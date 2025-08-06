import {Employee} from "../model/Employee.ts";
import EmployeesService, {SearchObject} from "./EmployeeService.ts";
import {v1 as nextId} from "uuid";
import _ from "lodash";
import {EmployeeAlreadyExistsError, EmployeeNotFoundError, EmployeeServiceError} from "./EmployeeServiceErrors.ts";

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
        const id = employee?.id ?? this._generateId();
        if (this.employees.has(id)) {
            throw new EmployeeAlreadyExistsError(id);
        }
        const newEmployee: Employee = {...employee, id};
        this.employees.set(id, newEmployee);
        return newEmployee;
    }

    deleteEmployee(id: string): Employee {
        const employee = this._findById(id);
        this.employees.delete(id);
        return employee;
    }

    updateEmployee(fields: Partial<Employee>): Employee {
        const employee = this._findById(fields.id);
        Object.assign(employee, fields);
        return employee;
    }

    _findById(id: string | undefined): Employee {
        if (!id) {
            throw new EmployeeServiceError(`Employee id is required`);
        }
        if (!this.employees.has(id)) {
            throw new EmployeeNotFoundError(`Employee id=${id} not found`);
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
            const departmentLowerCase = department.toLocaleLowerCase();
            filters.push(e => e.department.toLocaleLowerCase() === departmentLowerCase);
        }

        (salaryFrom !== undefined) && filters.push(e => e.salary >= salaryFrom);
        (salaryTo !== undefined) && filters.push(e => e.salary <= salaryTo);
        birthDateFrom && filters.push(e => e.birthDate >= birthDateFrom);
        birthDateTo && filters.push(e => e.birthDate <= birthDateTo);

        const filter: (e: Employee) => boolean = (e: Employee) =>
            filters.length > 0 ? filters.every(f => f(e)): true;

        return data.filter(filter);
    }
}
