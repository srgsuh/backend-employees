import "./EmployeeServiceMap.ts";
import "./EmployeeServiceMock.test.ts";
import {createEmployeeService} from "./registry.ts";

const employeeKey = process.argv[2] ?? process.env.EMPLOYEE_SERVICE;

export const employeeService = await createEmployeeService(employeeKey);
