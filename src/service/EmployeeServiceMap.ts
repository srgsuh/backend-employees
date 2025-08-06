import {Employee, Updater} from "../model/Employee.ts";
import EmployeesService, {SearchObject} from "./EmployeeService.ts";
import {v1 as nextId} from "uuid";
import _ from "lodash";

export default class EmployeesServiceMap implements EmployeesService {
    private employees: Map<string, Employee> = new Map();

    getAll(options?: SearchObject): Employee[] {
        const data = [...this.employees.values()];
        return this._filter(data, options);
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

    _filter(data: Employee[], options?: SearchObject): Employee[] {
        if (!options || _.isEmpty(options)) {
            return data;
        }

        const filters: ((e: Employee) => boolean)[] = [];

        const {department, salaryFrom, salaryTo, birthDateFrom, birthDateTo} = options;
        if (department) {
            filters.push(e => e.department === department);
        }
        if (salaryFrom !== undefined) {
            filters.push(e => e.salary >= salaryFrom);
        }
        if (salaryTo !== undefined) {
            filters.push(e => e.salary <= salaryTo);
        }
        if (birthDateFrom) {
            filters.push(e => e.birthDate >= birthDateFrom!);
        }
        if (birthDateTo) {
            filters.push(e => e.birthDate <= birthDateTo!);
        }

        const filter: (e: Employee) => boolean = (e: Employee) =>
            filters.length > 0 ? filters.every(f => f(e)): true;

        return data.filter(filter);
    }
}
