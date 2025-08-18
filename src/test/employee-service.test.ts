import {employeeService as service} from "../service/bootstrap.ts";
import test, {beforeEach, describe, it} from "node:test";
import assert from "node:assert";
import {
    EmployeeAlreadyExistsError,
    EmployeeNotFoundError,
} from "../model/Errors.ts";

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
    for (const e of array) {
        await service.deleteEmployee(e.id!);
    }
    for (const e of stateEmployees) {
        await service.addEmployee(e);
    }
});

describe("Test getEmployee(id) method", async () => {
    await it("On not existing id -> throw EmployeeNotFoundError", async () => {
        await assert.rejects(
            service.getEmployee("10000000000"),
            EmployeeNotFoundError,
        )
    });

    await it("On existing id -> return correct employee", async () => {
        const employee = stateEmployees[0];
        const employeeFromService = await service.getEmployee(employee.id!);
        assert.equal(employeeFromService.id, employee.id,
            "Returned employee id not equals to the id of employee to get");
    });
})

describe("Test deleteEmployee(id) method", async () => {
    await it("On not existing id -> throw EmployeeNotFoundError", async () => {
        await assert.rejects(
            service.deleteEmployee("10000000000"),
            EmployeeNotFoundError
        )
    });

    await it("On existing id -> delete correct employee", async () => {
        const employee = stateEmployees[1];
        const deletedEmployee = await service.deleteEmployee(employee.id!);
        assert.equal(employee.id, deletedEmployee.id, "Deleted employee id not equals to the id of employee to delete");
        await assert.rejects(
            service.getEmployee(employee.id!),
            EmployeeNotFoundError,
            "Employee still exists after deletion"
        );
    });
})

test("Add existing employee -> throw EmployeeAlreadyExists", async () => {
    await assert.rejects(
        service.addEmployee(stateEmployees[0]),
        EmployeeAlreadyExistsError
    );
});