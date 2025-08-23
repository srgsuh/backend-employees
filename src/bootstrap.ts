import "./service/Employees/EmployeeServiceMap.ts";
import "./service/Employees/EmployeeServiceMock.test.ts";
import "./service/Accounting/AccountingServiceMap.ts";
import "./service/Accounting/AccountingServiceMock.test.ts";
import "./service/Employees/EmployeeServiceSQLite.ts";

import EmployeeService from "./service/Employees/EmployeeService.ts";
import AccountingService from "./service/Accounting/AccountingService.ts";
import {container} from "./core/dependency-container.ts";


const employeeKey = process.env.EMPLOYEE_SERVICE!;
const accountingKey = process.env.ACCOUNTING_SERVICE!;

export const employeeService = await container.resolve<EmployeeService>(employeeKey);
export const accountingService = await container.resolve<AccountingService>(accountingKey);
export {container};