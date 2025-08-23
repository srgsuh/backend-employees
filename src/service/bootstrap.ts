import "./EmployeeServiceMap.ts";
import "./EmployeeServiceMock.test.ts";
import "./AccountingServiceMap.ts";
import "./AccountingServiceMock.test.ts";
import "./EmployeeServiceSQLite.ts";

import EmployeeService from "./EmployeeService.ts";
import AccountingService from "./AccountingService.ts";
import container from "./dependency-container.ts";

const employeeKey = process.env.EMPLOYEE_SERVICE!;
const accountingKey = process.env.ACCOUNTING_SERVICE!;

export const employeeService = await container.resolve<EmployeeService>(employeeKey);
export const accountingService = await container.resolve<AccountingService>(accountingKey);
