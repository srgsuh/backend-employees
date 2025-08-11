import {Employee} from "../model/Employee.ts";
import EmployeesService, {SearchObject} from "./EmployeeService.ts";
import {v1 as nextId} from "uuid";
import _ from "lodash";
import {EmployeeAlreadyExistsError, EmployeeNotFoundError} from "../model/Errors.ts";
import {FileStorage} from "./FileStorage.ts";
import Persistable from "./Persistable.ts";
import {employeeSchemaLoad} from "../schemas/employees.schema.ts";

class EmployeesServiceMap implements EmployeesService, Persistable {
    private employees: Map<string, Employee> = new Map();

    constructor(private storage: FileStorage<Employee>) {}

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
            throw new EmployeeNotFoundError(id);
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

    save() {
        this.storage.save(this.getAll());
    }

    load() {
        this.storage.load((e) => this.addEmployee(e));
        console.log(`${this.employees.size} entities loaded from DB file`);
    }
}
const employeeServiceMap = new EmployeesServiceMap(
    new FileStorage<Employee>(employeeSchemaLoad, process.env.DB_FILE_PATH)
);

employeeServiceMap.load();

export default employeeServiceMap;