import { de } from "zod/locales";
import { Employee } from "../model/Employee.ts";
import EmployeeService from "./EmployeeService.ts";
import type EmployeeRequestParams from "../model/EmployeeRequestParams.ts";

export class EmployeeServiceMock implements EmployeeService {
    getEmployee(id: string): Employee {
        return {id} as Employee;
    }
    getAll(options?: EmployeeRequestParams): Employee[] {
        return [];
    }
    addEmployee(employee: Employee): Employee {
        return employee;
    }
    deleteEmployee(id: string): Employee {
        return {} as Employee;
    }
    updateEmployee(id: string, fields: Partial<Employee>): Employee {
        return {id, ...fields} as Employee;
    }

}