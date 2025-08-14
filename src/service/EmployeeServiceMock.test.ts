import { de } from "zod/locales";
import { Employee } from "../model/Employee.ts";
import EmployeeService from "./EmployeeService.ts";
import type EmployeeRequestParams from "../model/EmployeeRequestParams.ts";

export class EmployeeServiceMock implements EmployeeService {
    getEmployee(id: string): Employee {
        return {} as Employee;
    }
    getAll(options?: EmployeeRequestParams): Employee[] {
        return [] as Employee[];
    }
    addEmployee(employee: Employee): Employee {
        return {} as Employee;
    }
    deleteEmployee(id: string): Employee {
        return {} as Employee;
    }
    updateEmployee(id: string, fields: Partial<Employee>): Employee {
        return {} as Employee;
    }

}