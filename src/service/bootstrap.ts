import {accountingServiceRegistry, employeeServiceRegistry} from "./registry.ts";
import "./EmployeeServiceMap.ts";
import "./EmployeeServiceMock.test.ts";
import "./AccountingServiceMap.ts";
import "./AccountingServiceMock.test.ts";
import "./EmployeeServiceSQLite.ts";
import type Persistable from "./Persistable.ts";
import { isPersistable } from "./Persistable.ts";

const employeeKey = process.env.EMPLOYEE_SERVICE;
const accountingKey = process.env.ACCOUNTING_SERVICE;

export const employeeService =
    await employeeServiceRegistry.createService(employeeKey!);

export const accountingService =
    await accountingServiceRegistry.createService(accountingKey!);

export function getPersistableServices(): Persistable[] {
    return [employeeService, accountingService].filter(
        service => isPersistable(service)
    );
}
