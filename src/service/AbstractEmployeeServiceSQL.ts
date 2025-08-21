import knex, {Knex} from "knex";
import { Employee } from "../model/Employee.ts";
import EmployeeRequestParams from "../model/EmployeeRequestParams.ts";
import type EmployeeService from "./EmployeeService.ts";
import Persistable from "./Persistable.ts";
import {EmployeeAlreadyExistsError, EmployeeNotFoundError} from "../model/Errors.ts";
import {v1 as nextId} from "uuid";

const TABLE_NAME = "employees";
const cId: keyof Employee = "id";
const cFullName: keyof Employee = "fullName";
const cDepartment: keyof Employee = "department";
const cBirthDate: keyof Employee = "birthDate";
const cSalary: keyof Employee = "salary";
const cAvatar: keyof Employee = "avatar";

const operators = {
    gte: ">=",
    lte: "<=",
}

export default abstract class AbstractEmployeeServiceSQL implements EmployeeService, Persistable {
    private readonly db: Knex;

    protected constructor(config: Knex.Config) {
        this.db = knex(config);
    }

    async createTable() {
        const exists = await this.db.schema.hasTable(TABLE_NAME);
        if (exists) return;
        await this.db.schema.createTable(TABLE_NAME, (table) => {
            table.string(cId).primary();
            table.string(cFullName);
            table.string(cDepartment);
            table.string(cBirthDate);
            table.integer(cSalary);
            table.string(cAvatar).defaultTo("");
        });
    }

    async getAll(options?: EmployeeRequestParams): Promise<Employee[]> {
        const query = this.db<Employee>(TABLE_NAME);
        const {department, ...rest} = options ?? {};
        if (department) {
            query.where({department});
        }
        Object.entries(rest).forEach(([key, value]) => {
            const [reqKey, reqOperator] = key.split("_");
            if (value !== undefined && reqOperator in operators) {
                query.where(reqKey, operators[reqOperator as keyof typeof operators], value);
            }
        })

        return query;
    }

    async getEmployee(id: string): Promise<Employee> {
        const e = await this._findById(id);
        if (!e) {
            throw new EmployeeNotFoundError(id);
        }
        return e;
    }

    async addEmployee(employee: Employee): Promise<Employee> {
        let id = employee.id;
        if (!id) {
            id = this._generateId();
        }
        else if (await this._findById(id)) {
            throw new EmployeeAlreadyExistsError(id);
        }
        const newEmployee: Employee = {...employee, id};
        const query = this.db(TABLE_NAME).insert(newEmployee);
        await query;
        return newEmployee;
    }

    async deleteEmployee(id: string): Promise<Employee> {
        const e = this.getEmployee(id);
        this.db(TABLE_NAME).delete().where({id});
        return e;
    }

    async updateEmployee(id: string, fields: Partial<Employee>): Promise<Employee> {
        const e = await this.getEmployee(id);
        this.db(TABLE_NAME).update(fields).where({id});
        return {...e, ...fields};
    }

    async save(): Promise<void> {
        await this.db.destroy();
    }

    private async _findById(id: string) {
        const query = this.db.select<Employee>().from(TABLE_NAME).where({id});
        return query.first();
    }

    private _generateId(): string {
        return nextId();
    }
}