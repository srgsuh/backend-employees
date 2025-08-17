import type EmployeeService from "./EmployeeService.js";
import {ServiceRegistry} from "./ServiceRegistry.js";

export const employeeServiceRegistry = new ServiceRegistry<EmployeeService>("EmployeeService");
