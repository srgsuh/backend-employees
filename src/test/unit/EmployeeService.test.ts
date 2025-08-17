import {employeeService as service} from "../../service/bootstrap.ts";
import test, {beforeEach} from "node:test";
import assert from "node:assert";
import {EmployeeAlreadyExistsError} from "../../model/Errors.ts";

const stateEmployees = [
    {
        id: "1",
        fullName: "John",
        department: "QA",
        avatar: "",
        salary: 30_000,
        birthDate: "2000-01-01"
    },
    {
        id: "2",
        fullName: "Jane",
        department: "HR",
        avatar: "",
        salary: 21_000,
        birthDate: "1990-01-01"
    },
    {
        id: "3",
        fullName: "Alice",
        department: "IT",
        avatar: "",
        salary: 99_000,
        birthDate: "1982-01-01"
    }
];

beforeEach(async () => {
    const array = await service.getAll();
    array.forEach(e => service.deleteEmployee(e.id!));
    stateEmployees.forEach(e => service.addEmployee(e));
});

test("Add existing employee -> throw EmployeeAlreadyExists", async () => {
    await assert.rejects(
        service.addEmployee(stateEmployees[0]),
        EmployeeAlreadyExistsError
    );
});