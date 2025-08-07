import {Employee} from "../model/Employee.ts";
import EmployeesService, {SearchObject} from "./EmployeeService.ts";
import {v1 as nextId} from "uuid";
import _ from "lodash";
import {EmployeeAlreadyExistsError, EmployeeNotFoundError} from "./EmployeeServiceErrors.ts";

class EmployeesServiceMap implements EmployeesService {
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

    updateEmployee(id: string, fields: Partial<Employee>): Employee {
        const employee = this._findById(id);
        Object.assign(employee, fields);
        return employee;
    }

    _findById(id: string): Employee {
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

        salaryFrom !== undefined && filters.push(e => e.salary >= salaryFrom);
        salaryTo !== undefined && filters.push(e => e.salary <= salaryTo);
        birthDateFrom && filters.push(e => e.birthDate >= birthDateFrom);
        birthDateTo && filters.push(e => e.birthDate <= birthDateTo);

        const filter = (e: Employee) => filters.every(f => f(e));

        return data.filter(filter);
    }
}

export default new EmployeesServiceMap();