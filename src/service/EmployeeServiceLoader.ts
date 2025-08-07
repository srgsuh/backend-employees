import EmployeesService from "./EmployeeService.ts";
import EmployeesServiceMap from "./EmployeeServiceMap.js";
import {EmployeeArray, employeeArraySchema} from "../schemas/employees.schema.js";
import {readFromFile} from "../utils/fs-utils.js";

export default class EmployeeServiceLoader {
    private service: EmployeesService | undefined;
    getService(): EmployeesService {
        if (!this.service) {
            this.service = new EmployeesServiceMap();
        }
        return this.service;
    }
    loadData(path: string) {
        const service = this.getService();
        const data = readFromFile<EmployeeArray>(path, employeeArraySchema);
        if (data) {
            service.addAll(data);
        }
    }
}