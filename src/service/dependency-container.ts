import {DIContainer} from "./DIContainer.ts";
import {StorageProvider} from "./StorageProvider.ts";
import {Employee} from "../model/Employee.ts";
import {FileStorage} from "./FileStorage.ts";
import {ZodType} from "zod";
import {employeeSchemaLoad} from "../schemas/employees.schema.ts";
import EmployeeService from "./EmployeeService.ts";
import {EmployeeServiceMock} from "./EmployeeServiceMock.test.ts";
import {EmployeeServiceMap} from "./EmployeeServiceMap.ts";
import type Account from "../model/Account.ts";
import AccountingService from "./AccountingService.ts";
import {AccountingServiceMock} from "./AccountingServiceMock.test.ts";
import {AccountingServiceMap} from "./AccountingServiceMap.ts";
import {accountSchema} from "../schemas/account.schema.ts";
import {Knex} from "knex";
import {configBetterSQLite3, configSQLite3} from "./db.config.ts";
import {KnexDatabase} from "./KnexDatabase.ts";
import {EmployeeServiceSQLite} from "./EmployeeServiceSQLite.ts";

const container = new DIContainer();
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

const employeeService = await container.resolve<EmployeeService>(process.env.EMPLOYEE_SERVICE!);
const accountingService = await container.resolve<AccountingService>(process.env.ACCOUNTING_SERVICE!);