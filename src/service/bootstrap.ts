import "./EmployeeServiceMap.ts";
import "./EmployeeServiceMock.test.ts";
import {employeeServiceRegistry} from "./registry.ts";

const employeeKey = process.argv[2] ?? process.env.EMPLOYEE_SERVICE;

export const employeeService =
    await employeeServiceRegistry.createService(employeeKey);
