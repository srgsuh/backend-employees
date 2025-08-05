import {Employee, Updater} from "../model/Employee.ts";
import EmployeesService from "./EmployeeService.ts";
import {v1 as nextId} from "uuid";

export default class EmployeesServiceMap implements EmployeesService {
    private employees: Map<string, Employee> = new Map();

    getAll(department?: string): Employee[] {
        const data = [...this.employees.values()];
        return this._filter(data, department);
    }

    getEmployee(id: string): Employee {
        return this._findById(id);
    }

    addEmployee(employee: Employee): Employee {
        const id = this._generateId();
        employee.id = id;
        this.employees.set(id, employee);
        return employee;
    }

    deleteEmployee(id: string): Employee {
        const employee = this._findById(id);
        this.employees.delete(id);
        return employee;
    }

    updateEmployee({id, fields}: Updater): Employee {
        const employee = this._findById(id);
        const newEmployee: Employee = {...employee, ...fields, id};
        this.employees.set(id, newEmployee);
        return newEmployee;
    }

    _findById(id: string): Employee {
        if (!id) {
            throw new RangeError(`Employee id is required`);
        }
        if (!this.employees.has(id)) {
            throw new RangeError(`Employee id=${id} not found`);
        }
        return this.employees.get(id)!;
    }

    _generateId(): string {
        return nextId();
    }

    _filter(data: Employee[], department?: string): Employee[] {
        return department?
            data.filter(employee => employee.department === department): data;
    }
}