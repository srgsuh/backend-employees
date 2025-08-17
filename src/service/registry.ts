import {ServiceRegistry} from "./ServiceRegistry.ts";
import type AccountingService from "./AccountingService.ts";
import type EmployeeService from "./EmployeeService.ts";

export const employeeServiceRegistry = new ServiceRegistry<EmployeeService>("EmployeeService");

export const accountingServiceRegistry = new ServiceRegistry<AccountingService>("AccountingService");