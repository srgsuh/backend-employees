import {Employee, Updater} from "../model/Employee.ts";

export default interface EmployeesService {
    getAll(): Employee[];
    getEmployee(id: string): Employee;
    addEmployee(employee: Employee): Employee;
    deleteEmployee(id: string): Employee;
    updateEmployee(updater: Updater): Employee;
}