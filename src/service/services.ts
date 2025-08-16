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

export function getEmployeeService(): EmployeeService {
    console.log("process.env.NODE_TEST_CONTEXT: ", process.env.NODE_TEST_CONTEXT);
    console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);
    if (process.env.NODE_TEST_CONTEXT) {
        console.log("Using mock EmployeeService");
        return new EmployeeServiceMock();
    }
    console.log("Using EmployeesServiceMap EmployeeService");
    return new EmployeesServiceMap(
        new FileStorage<Employee>(employeeSchemaLoad, process.env.DB_FILE_PATH)
    );
}

export function getAccountingService(): AccountingService {
    if (process.env.NODE_TEST_CONTEXT) {
        return new AccountingServiceMock();
    }
    return new AccountingServiceMap();
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