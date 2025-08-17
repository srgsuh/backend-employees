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
import { employeeService } from "./bootstrap.ts";

let accountService: AccountingService | undefined = undefined;

export function getAccountingService(): AccountingService {
    if (process.env.NODE_TEST_CONTEXT) {
        return new AccountingServiceMock();
    }
    if (!accountService) {
        accountService = new AccountingServiceMap(
            new FileStorage<Account>(accountSchema, process.env.ACCOUNTS_FILE_PATH)
        );
    }
    return accountService;
}

export function getPersistableServices(): Persistable[] {
    return [employeeService, getAccountingService()].filter(
        service => isPersistable(service)
    );
}