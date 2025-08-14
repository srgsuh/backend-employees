import {Employee} from "../model/Employee.ts";
import type EmployeeRequestParams from "../model/EmployeeRequestParams.ts";

export default interface EmployeeService {
    getEmployee(id: string): Employee;
    getAll(options?: EmployeeRequestParams): Employee[];
    addEmployee(employee: Employee): Employee;
    deleteEmployee(id: string): Employee;
    updateEmployee(id: string, fields: Partial<Employee>): Employee;
}