import type {Employee} from "../../model/Employee.ts";
import type EmployeeRequestParams from "../../model/EmployeeRequestParams.ts";
import type EmployeeService from "./EmployeeService.ts";
import {v1 as nextId} from "uuid";
import _ from "lodash";
import {EmployeeAlreadyExistsError, EmployeeNotFoundError} from "../../model/Errors.ts";
import {StorageProvider} from "../StorageProvider.ts";
import {Closable} from "../ServiceLifecycle.ts";

export class EmployeeServiceMap implements EmployeeService, Closable {
    private employees: Map<string, Employee> = new Map();

    constructor(private storage: StorageProvider<Employee>) {
        this.load();
    }

    async getAll(options?: EmployeeRequestParams): Promise<Employee[]> {
        const data = [...this.employees.values()];
        return await this._filter(data, options);
    }

    async getEmployee(id: string): Promise<Employee> {
        return await this._findById(id);
    }

    async addEmployee(employee: Employee): Promise<Employee> {
        let id = employee?.id;
        if (!id) {
           id = this._generateId();
        }
        if (this.employees.has(id)) {
            throw new EmployeeAlreadyExistsError(id);
        }
        const newEmployee: Employee = {...employee, id};
        this.employees.set(id, newEmployee);
        return newEmployee;
    }

    async deleteEmployee(id: string): Promise<Employee> {
        const employee = await this._findById(id);
        this.employees.delete(id);
        return employee;
    }

    async updateEmployee(id: string, fields: Partial<Employee>): Promise<Employee> {
        const employee = await this._findById(id);
        Object.assign(employee, fields);
        return employee;
    }

    async _findById(id: string): Promise<Employee> {
        if (!this.employees.has(id)) {
            throw new EmployeeNotFoundError(id);
        }
        return this.employees.get(id)!;
    }

    _generateId(): string {
        return nextId();
    }

    async _filter(data: Employee[], options?: EmployeeRequestParams): Promise<Employee[]> {
        if (!options || _.isEmpty(options)) {
            return data;
        }
        const filters: ((e: Employee) => boolean)[] = [];

        const {department, salary_gte, salary_lte, birthDate_gte, birthDate_lte} = options;
        if (department) {
            const departmentLowerCase = department.toLowerCase();
            filters.push(e => e.department.toLowerCase() === departmentLowerCase);
        }

        salary_gte !== undefined && filters.push(e => e.salary >= salary_gte);
        salary_lte !== undefined && filters.push(e => e.salary <= salary_lte);
        birthDate_gte && filters.push(e => e.birthDate >= birthDate_gte);
        birthDate_lte && filters.push(e => e.birthDate <= birthDate_lte);

        const filter = (e: Employee) => filters.every(f => f(e));

        return data.filter(filter);
    }

    async onClose(): Promise<void> {
        this.storage.save(await this.getAll());
        console.log(`EmployeeServiceMap: ${this.employees.size} entities saved to DB file`);
    }

    private load() {
        this.storage.load((e) => this.addEmployee(e));
        console.log(`EmployeeServiceMap: ${this.employees.size} entities loaded from DB file`);
    }
}