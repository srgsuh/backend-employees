import knex, {Knex} from "knex";
import {Employee} from "../model/Employee.ts";
import EmployeeRequestParams from "../model/EmployeeRequestParams.ts";
import type EmployeeService from "./EmployeeService.ts";
import Persistable from "./Persistable.ts";
import {EmployeeAlreadyExistsError, EmployeeNotFoundError, QueryLimitExceededError} from "../model/Errors.ts";
import {v1 as nextId} from "uuid";
import _ from "lodash";
import {getEnvIntVariable} from "../utils/env-utils.ts";

const ROWS_LIMIT = 1000;
const rowsLimit = getEnvIntVariable("ROWS_LIMIT", ROWS_LIMIT);

export const TABLE_NAME = "employees";
const cId: keyof Employee = "id";
const cFullName: keyof Employee = "fullName";
const cDepartment: keyof Employee = "department";
const cBirthDate: keyof Employee = "birthDate";
const cSalary: keyof Employee = "salary";
const cAvatar: keyof Employee = "avatar";

type Operators = "<=" | ">=" | "=";
type WhereClauseParameters = {column: string, operator: Operators};
const parameterMapper: Record<keyof EmployeeRequestParams, WhereClauseParameters> = {
    department: {column: cDepartment, operator: "="},
    salary_gte: {column: cSalary, operator: ">="},
    salary_lte: {column: cSalary, operator: "<="},
    birthDate_gte: {column: cBirthDate, operator: ">="},
    birthDate_lte: {column: cBirthDate, operator: "<="},
}

export default abstract class AbstractEmployeeServiceSQL implements EmployeeService, Persistable {
    protected readonly db: Knex;

    protected constructor(config: Knex.Config) {
        this.db = knex(config);
    }

    async createTable() {
        if (!await this.db.schema.hasTable(TABLE_NAME)) {
            await this.db.schema.createTable(TABLE_NAME, (table) => {
                table.string(cId).primary();
                table.string(cFullName);
                table.string(cDepartment);
                table.string(cBirthDate);
                table.integer(cSalary);
                table.string(cAvatar).defaultTo("");
            });
        }
    }

    async getAll(options: EmployeeRequestParams = {}) {
        const count = await this._count(options);
        if(count > this.maxRows) {
            throw new QueryLimitExceededError(count, this.maxRows);
        }
       return await this._getAll(options);
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
        else if (await this._isIdExists(id)) {
            throw new EmployeeAlreadyExistsError(id);
        }
        const newEmployee: Employee = {...employee, id};
        await this.db(TABLE_NAME).insert(newEmployee);
        return newEmployee;
    }

    async deleteEmployee(id: string): Promise<Employee> {
        const e = await this.getEmployee(id);
        await this.db(TABLE_NAME).where({id}).del();
        return e;
    }

    async updateEmployee(id: string, fields: Partial<Employee>): Promise<Employee> {
        const e = await this.getEmployee(id);
        await this.db(TABLE_NAME).where({id}).update(fields);
        return {...e, ...fields};
    }

    async save(): Promise<void> {
        await this.db.destroy();
    }

    get maxRows(): number {
        return rowsLimit;
    }

    private async _getAll(options: EmployeeRequestParams) {
        const query = this.db.table<Employee>(TABLE_NAME);
        this._buildWhereClause(query, options);
        return await query;
    }

    protected async _count(options: EmployeeRequestParams): Promise<number> {
        const query = this.db.table(TABLE_NAME).count<{"count": number}[]>({count: "id"});
        this._buildWhereClause(query, options);
        const count =  await query;
        return count[0].count;
    }

    protected _buildWhereClause(query: Knex.QueryBuilder, options: EmployeeRequestParams): void {
        _.toPairs(options)
            .map(([key, value]) =>
                [parameterMapper[key as keyof EmployeeRequestParams], value])
            .forEach(([mapped, value]) => {
                query.where(mapped.column, mapped.operator, value);
            })
    }

    protected async _findById(id: string) {
        const query = this.db.select<Employee>().from(TABLE_NAME).where({id});
        return query.first();
    }

    protected async _isIdExists(id: string): Promise<boolean> {
        return (await this._findById(id)) !== undefined;
    }

    protected _generateId(): string {
        return nextId();
    }
}