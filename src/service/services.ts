import type EmployeeService from "./EmployeeService.ts";
import {type Employee} from "../model/Employee.ts";
import {employeeSchemaLoad} from "../schemas/employees.schema.ts";
import {EmployeesServiceMap} from "./EmployeeServiceMap.ts";
import {EmployeeServiceMock} from "./EmployeeServiceMock.test.ts";
import {FileStorage} from "./FileStorage.ts";
import type AccountingService from "./AccountingService.ts";
import { AccountingServiceMap } from "./AccountingServiceMap.ts";
import Persistable, { isPersistable } from "./Persistable.ts";
import { AccountingServiceMock } from "./AccountingServiceMock.test.ts";
import Account from "../model/Account.ts";
import {accountSchema} from "../schemas/account.schema.ts";

export function getEmployeeService(): EmployeeService {
    if (process.env.NODE_TEST_CONTEXT) {
        return new EmployeeServiceMock();
    }
    return new EmployeesServiceMap(
        new FileStorage<Employee>(employeeSchemaLoad, process.env.DB_FILE_PATH)
    );
}

export function getAccountingService(): AccountingService {
    if (process.env.NODE_TEST_CONTEXT) {
        return new AccountingServiceMock();
    }
    return new AccountingServiceMap(
        new FileStorage<Account>(accountSchema, process.env.ACCOUNTS_FILE_PATH)
    );
}

export function getPersistableServices(): Persistable[] {
    return [getEmployeeService(), getAccountingService()].filter(
        service => isPersistable(service)
    );
}