import type EmployeeService from "./EmployeeService.ts";
import {type Employee} from "../model/Employee.ts";
import {employeeSchemaLoad} from "../schemas/employees.schema.ts";
import {EmployeesServiceMap} from "./EmployeeServiceMap.ts";
import {EmployeeServiceMock} from "./EmployeeServiceMock.test.ts";
import {FileStorage} from "./FileStorage.ts";
import type AccountingService from "./AccountingService.ts";
import { AccountingServiceMap } from "./AccountingServiceMap.ts";
import Persistable, { isPersistable } from "./Persistable.ts";

export function getEmployeeService(): EmployeeService {
    let service: EmployeeService | undefined = undefined;
    if (!service) {
        if (process.env.NODE_TEST_CONTEXT) {
            service = new EmployeeServiceMock();
        } else {
            service = new EmployeesServiceMap(
                new FileStorage<Employee>(employeeSchemaLoad, process.env.DB_FILE_PATH)
            );
        }
    }
    return service;
}

export function getAccountingService(): AccountingService {
    let service: AccountingService | undefined = undefined;
    if (!service) {
        service = new AccountingServiceMap();
    }
    return service;
}

export function getPersistableServices(): Persistable[] {
    const items: Persistable[] = [];
    for (const service of [getEmployeeService(), getAccountingService()]) {
        if (isPersistable(service)) {
            items.push(service);
        }
    }
    return items
}