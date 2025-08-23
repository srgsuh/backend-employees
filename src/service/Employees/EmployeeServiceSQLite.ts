import AbstractEmployeeServiceSQL, {TABLE_NAME} from "./AbstractEmployeeServiceSQL.ts";
import {Employee} from "../../model/Employee.ts";
import {EmployeeAlreadyExistsError, EmployeeNotFoundError} from "../../model/Errors.ts";
import {KnexDatabase} from "../KnexDatabase.ts";
import {Initializable} from "../ServiceLifecycle.ts";

export class EmployeeServiceSQLite extends AbstractEmployeeServiceSQL implements Initializable{
    constructor(dataBase: KnexDatabase) {
        super(dataBase);
    }

    async onInitialize(): Promise<void> {
        await this.createTable();
        console.log(`EmployeeServiceSQLite: service is initialized`);
    }

    async addEmployee(employee: Employee): Promise<Employee> {
        const id = employee.id || this._generateId();
        try {
            const e = await this.db(TABLE_NAME).insert({...employee, id})
                .returning<Employee[]>("*");
            return e[0];
        }
        catch (e) {
            throw new EmployeeAlreadyExistsError(id);
        }
    }

    async updateEmployee(id: string, fields: Partial<Employee>): Promise<Employee> {
        const employees = await this.db(TABLE_NAME)
            .where({id}).update(fields).returning<Employee[]>("*");
        if (employees.length === 0) {
            throw new EmployeeNotFoundError(id);
        }
        return employees[0];
    }
}