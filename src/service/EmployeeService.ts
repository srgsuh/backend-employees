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
    addAll(employees: Employee[]): void;
    deleteEmployee(id: string): Employee;
    updateEmployee(fields: Partial<Employee>): Employee;
}