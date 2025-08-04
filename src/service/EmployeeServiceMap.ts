import { Employee } from "../model/Employee.ts";
import EmployeesService from "./EmployeeService.ts";

export default class EmployeesServiceMap implements EmployeesService {
    private employees: Map<string, Employee> = new Map();
//TODO
}