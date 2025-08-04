import {Employee, Updater} from "../model/Employee.ts";

export default interface EmployeesService {
    getAll(): Employee[];
    get(id: string): Employee;
    add(employee: Employee): Employee;
    delete(id: string): Employee;
    update(updater: Updater): Employee;
}