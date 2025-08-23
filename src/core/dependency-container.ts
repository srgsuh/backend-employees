import {DIContainer} from "./di/DIContainer.ts";
import {StorageProvider} from "../service/StorageProvider.ts";
import {Employee} from "../model/Employee.ts";
import {FileStorage} from "../service/FileStorage.ts";
import {ZodType} from "zod";
import {employeeSchemaLoad} from "../schemas/employees.schema.ts";
import EmployeeService from "../service/Employees/EmployeeService.ts";
import {EmployeeServiceMock} from "../service/Employees/EmployeeServiceMock.test.ts";
import {EmployeeServiceMap} from "../service/Employees/EmployeeServiceMap.ts";
import type Account from "../model/Account.ts";
import AccountingService from "../service/Accounting/AccountingService.ts";
import {AccountingServiceMock} from "../service/Accounting/AccountingServiceMock.test.ts";
import {AccountingServiceMap} from "../service/Accounting/AccountingServiceMap.ts";
import {accountSchema} from "../schemas/account.schema.ts";
import {Knex} from "knex";
import {configBetterSQLite3, configSQLite3} from "./db.config.ts";
import {KnexDatabase} from "../service/KnexDatabase.ts";
import {EmployeeServiceSQLite} from "../service/Employees/EmployeeServiceSQLite.ts";
import {AccountingServiceSQL} from "../service/Accounting/AccountingServiceSQL.js";

export const container = new DIContainer();
// Configuration, schemas, etc.
container.register<ZodType<Employee, any>>("schema.employee",
    async ()=>employeeSchemaLoad
);
container.register<ZodType<Account, any>>("schema.account",
    async ()=>accountSchema
);
container.register<Knex.Config>( "better-sqlite3.config", async ()=>configBetterSQLite3
)
container.register<Knex.Config>( "sqlite3.config", async ()=>configSQLite3
);
// Loaders, DBs, etc.
container.register<KnexDatabase>( "better-sqlite3.database",
    async (c)=>new KnexDatabase(
        await c.resolve<Knex.Config>("better-sqlite3.config")
    )
);
container.register<KnexDatabase>( "sqlite3.database",
    async (c)=>new KnexDatabase(
        await c.resolve<Knex.Config>("sqlite3.config")
    )
);
container.register<StorageProvider<Employee>>("storage.employee",
    async (c: DIContainer)=>new FileStorage<Employee>(
        await c.resolve<ZodType<Employee, any>>("schema.employee"), process.env.EMPLOYEES_FILE_PATH)
);
container.register<StorageProvider<Account>>("storage.account",
    async (c: DIContainer)=>new FileStorage<Account>(
        await c.resolve<ZodType<Account, any>>("schema.account"), process.env.ACCOUNTS_FILE_PATH)
);

// Services
container.register<EmployeeService>( EmployeeServiceMock.name,
    async ()=>new EmployeeServiceMock()
);
container.register<EmployeeService>( EmployeeServiceMap.name,
    async (c: DIContainer)=>new EmployeeServiceMap(
        await c.resolve<StorageProvider<Employee>>("storage.employee"))
);
container.register<EmployeeService>( EmployeeServiceSQLite.name,
    async (c: DIContainer)=>new EmployeeServiceSQLite(
        await c.resolve<KnexDatabase>("better-sqlite3.database"))
);
container.register<AccountingService>( AccountingServiceMock.name,
    async ()=>new AccountingServiceMock()
);
container.register<AccountingService>( AccountingServiceMap.name,
    async (c: DIContainer)=>new AccountingServiceMap(
        await c.resolve<StorageProvider<Account>>("storage.account"))
);
container.register<AccountingService>( AccountingServiceSQL.name,
    async (c: DIContainer)=>new AccountingServiceSQL(
        await c.resolve<KnexDatabase>("better-sqlite3.database")
    )
);
