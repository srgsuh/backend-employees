import {Employee, Updater} from "../model/Employee.ts";
import EmployeesService from "./EmployeeService.ts";

export default class EmployeesServiceMap implements EmployeesService {
    private employees: Map<string, Employee> = new Map();
    private idCounter: number = 0;

    getAll(): Employee[] {
        return Array.from(this.employees.values());
    }

    get(id: string): Employee {
        return this._findById(id);
    }

    add(employee: Employee): Employee {
        const id = this._generateId();
        employee.id = id;
        this.employees.set(id, employee);
        return employee;
    }

    delete(id: string): Employee {
        const employee = this._findById(id);
        this.employees.delete(id);
        return employee;
    }

    update({id, fields}: Updater): Employee {
        const employee = this._findById(id);
        const newEmployee: Employee = {...employee, ...fields, id};
        this.employees.set(id, newEmployee);
        return newEmployee;
    }

    _findById(id: string): Employee {
        if (!this.employees.has(id)) {
            throw new RangeError(`Employee (id=${id}) is not found`);
        }
        return this.employees.get(id)!;
    }

    _generateId(): string {
        return `${++this.idCounter}`;
    }
}