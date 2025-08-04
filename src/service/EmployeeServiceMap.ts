import { Employee } from "../model/Employee.ts";
import EmployeesService from "./EmployeeService.ts";

export default class EmployeesServiceMap implements EmployeesService {
    private employees: Map<string, Employee> = new Map();
    constructor() {
        this.employees.set("1", {
            id: "1",
            department: "IT",
            fullName: "Eugene Zamyatin",
            avatar: "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/128/9.jpg",
            birthDate: "1884-02-01",
            salary: 75000
        });
        this.employees.set("2", {
            id: "2",
            department: "QA",
            fullName: "Aldous Huxley",
            avatar: "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/128/54.jpg",
            birthDate: "1894-07-26",
            salary: 70000
        });
        this.employees.set("3", {
            id: "3",
            department: "Sales",
            fullName: "George Orwell",
            avatar: "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/128/63.jpg",
            birthDate: "1903-06-25",
            salary: 55000
        });
    }

    getAll(): Employee[] {
        return Array.from(this.employees.values());
    }

    get(id: string): Employee {
        if (!this.employees.has(id)) {
            throw new RangeError(`Employee (id=${id}) not found`);
        }
        return this.employees.get(id)!;
    }
//TODO
}