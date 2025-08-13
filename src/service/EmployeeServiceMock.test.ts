import { de } from "zod/locales";
import { Employee } from "../model/Employee.ts";
import EmployeesService, { SearchObject } from "./EmployeeService.ts";

export class EmployeeServiceMock implements EmployeesService {
    getEmployee(id: string): Employee {
        return {} as Employee;
    }
    getAll(options?: SearchObject): Employee[] {
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