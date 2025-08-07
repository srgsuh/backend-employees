import {Employee} from "../model/Employee.ts";

export interface SearchObject {
    department?: string;
    salary_gte?: number;
    salary_lte?: number;
    birthDate_gte?: string;
    birthDate_lte?: string;
}

export default interface EmployeesService {
    getEmployee(id: string): Employee;
    getAll(options?: SearchObject): Employee[];
    addEmployee(employee: Employee): Employee;
    deleteEmployee(id: string): Employee;
    updateEmployee(id: string, fields: Partial<Employee>): Employee;
}