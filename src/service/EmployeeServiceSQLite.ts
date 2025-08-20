import AbstractEmployeeServiceSQL from "./AbstractEmployeeServiceSQL.ts";
import {Knex} from "knex";
import {employeeServiceRegistry} from "./registry.js";

export class EmployeeServiceSQLite extends AbstractEmployeeServiceSQL{
    constructor(config: Knex.Config) {
        super(config);
    }
}

employeeServiceRegistry.registerService(
    EmployeeServiceSQLite.name,
    async () => {
        const service: AbstractEmployeeServiceSQL = new EmployeeServiceSQLite({
            client: "sqlite3",
            connection: {
                filename: process.env.SQLITE_FILE_NAME ?? "db.sqlite"
            },
            useNullAsDefault: true,
        });
        await service.createTable();
        return service;
    }
);