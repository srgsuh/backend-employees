import {Employee} from "../model/Employee.ts";

export interface SearchObject {
    department?: string;
    salaryFrom?: number;
    salaryTo?: number;
    birthDateFrom?: string;
    birthDateTo?: string;
}

export default interface EmployeesService {
    getEmployee(id: string): Employee;
    getAll(options?: SearchObject): Employee[];
    addEmployee(employee: Employee): Employee;
    deleteEmployee(id: string): Employee;
    updateEmployee(id: string, fields: Partial<Employee>): Employee;
}