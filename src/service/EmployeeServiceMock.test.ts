import { Employee } from "../model/Employee.ts";
import EmployeeService from "./EmployeeService.ts";
import type EmployeeRequestParams from "../model/EmployeeRequestParams.ts";
import { employeeServiceRegistry } from "./registry.ts";

export class EmployeeServiceMock implements EmployeeService {
    async getEmployee(id: string): Promise<Employee> {
        return {id} as Employee;
    }
    async getAll(_options?: EmployeeRequestParams): Promise<Employee[]> {
        return [];
    }
    async addEmployee(employee: Employee): Promise<Employee> {
        return employee;
    }
    async deleteEmployee(id: string): Promise<Employee> {
        return {id} as Employee;
    }
    async updateEmployee(id: string, fields: Partial<Employee>): Promise<Employee> {
        return {id, ...fields} as Employee;
    }
}

employeeServiceRegistry.registerService("mock", async () => new EmployeeServiceMock());