import {Employee} from "../model/Employee.ts";
import type EmployeeRequestParams from "../model/EmployeeRequestParams.ts";

export default interface EmployeeService {
    getEmployee(id: string): Promise<Employee>;
    getAll(options?: EmployeeRequestParams): Promise<Employee[]>;
    addEmployee(employee: Employee): Promise<Employee>;
    deleteEmployee(id: string): Promise<Employee>;
    updateEmployee(id: string, fields: Partial<Employee>): Promise<Employee>;
}