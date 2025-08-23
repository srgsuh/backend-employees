import AbstractEmployeeServiceSQL, {TABLE_NAME} from "./AbstractEmployeeServiceSQL.ts";
import {Knex} from "knex";
import {employeeServiceRegistry} from "./registry.ts";
import {Employee} from "../model/Employee.ts";
import {EmployeeAlreadyExistsError, EmployeeNotFoundError} from "../model/Errors.ts";
import {KnexDatabase} from "./KnexDatabase.js";
import {configBetterSQLite3} from "./db.config.js";

export class EmployeeServiceSQLite extends AbstractEmployeeServiceSQL{
    constructor(dataBase: KnexDatabase) {
        super(dataBase);
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
            .update(fields).where({id}).returning<Employee[]>("*");
        if (employees.length === 0) {
            throw new EmployeeNotFoundError(id);
        }
        return employees[0];
    }
}

employeeServiceRegistry.registerService(
    EmployeeServiceSQLite.name,
    async () => {
        const service: AbstractEmployeeServiceSQL = new EmployeeServiceSQLite(
            new KnexDatabase(configBetterSQLite3)
        );
        await service.createTable();
        return service;
    }
);