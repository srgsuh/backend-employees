import {Employee, Updater} from "../model/Employee.ts";

export interface SearchObject {
    department?: string;
    salaryFrom?: number;
    salaryTo?: number;
    birthDateFrom?: string;
    birthDateTo?: string;
}

export default interface EmployeesService {
    getAll(options?: SearchObject): Employee[];
    getEmployee(id: string): Employee;
    addEmployee(employee: Employee): Employee;
    deleteEmployee(id: string): Employee;
    updateEmployee(fields: Partial<Employee>): Employee;
}