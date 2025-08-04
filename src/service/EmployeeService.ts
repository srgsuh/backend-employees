import { Employee } from "../model/Employee.ts";

export default interface EmployeesService {
    //TODO
    getAll(): Employee[];
}