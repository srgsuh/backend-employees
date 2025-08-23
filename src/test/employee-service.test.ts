import {employeeService as service} from "../service/bootstrap.ts";
import {after, beforeEach, describe, it} from "node:test";
import assert from 'node:assert/strict';
import {
    EmployeeAlreadyExistsError,
    EmployeeNotFoundError, QueryLimitExceededError,
} from "../model/Errors.ts";
import {Employee} from "../model/Employee.ts";
import EmployeeRequestParams from "../model/EmployeeRequestParams.ts";
import _ from "lodash";
import {isPersistable} from "../service/Persistable.js";

const e1: Employee = {
    id: "1",
    fullName: "Name1",
    department: "QA",
    avatar: "",
    salary: 30_000,
    birthDate: "2002-01-01"
};
const e2: Employee = {
    id: "2",
    fullName: "Name2",
    department: "HR",
    avatar: "",
    salary: 21_000,
    birthDate: "1992-01-01"
};
const e3: Employee = {
    id: "3",
    fullName: "Name3",
    department: "IT",
    avatar: "",
    salary: 79_000,
    birthDate: "1982-01-01"
};
const e4: Employee = {
    id: "4",
    fullName: "Name4",
    department: "IT",
    avatar: "",
    salary: 89_000,
    birthDate: "1982-10-20"
};
const e5: Employee = {
    id: "5",
    fullName: "Name5",
    department: "IT",
    avatar: "",
    salary: 99_000,
    birthDate: "1982-10-06"
};
const dbArray: Employee[] = [e1, e2, e3, e4, e5];

const newEmployee = {
    fullName: "New Name",
    department: "Sales",
    avatar: "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/128/80.jpg",
    salary: 27000,
    birthDate: "2001-02-03"
}

after(async () => {
    if (isPersistable(service)) {
        await service.save();
    }
});

beforeEach(async () => {
    const array = await service.getAll();
    for (const e of array) {
        await service.deleteEmployee(e.id!);
    }
    for (const e of dbArray) {
        await service.addEmployee(e);
    }
});

function compareArrays(received: Employee[], expected: Employee[]) {
    assert.deepStrictEqual(_.sortBy(received, "id"), _.sortBy(expected, "id"));
}

describe("Test getEmployee method", async () => {
    await it("On non-existent id -> throw EmployeeNotFoundError", async () => {
        await assert.rejects(
            service.getEmployee("10000000000"),
            EmployeeNotFoundError,
        )
    });

    await it("On existing id -> return correct employee", async () => {
        const employee = dbArray[0];
        const employeeFromService = await service.getEmployee(employee.id!);
        assert.deepStrictEqual(employeeFromService, employee);
    });
})

describe("Test deleteEmployee method", async () => {
    await it("On non-existent id -> throw EmployeeNotFoundError", async () => {
        await assert.rejects(
            service.deleteEmployee("10000000000"),
            EmployeeNotFoundError
        )
    });

    await it("On existing id -> return deleted employee", async () => {
        const employee = dbArray[2];
        const fromService = await service.deleteEmployee(employee.id!);
        assert.deepStrictEqual(fromService, employee);
    })

    await it("On existing id -> delete employee", async () => {
        const employee = dbArray[1];
        await service.deleteEmployee(employee.id!);

        await assert.rejects(
            service.getEmployee(employee.id!),
            EmployeeNotFoundError,
        );
    });
});

describe("Test addEmployee method", async () => {
    await it("On existing id -> throw EmployeeAlreadyExistsError", async () => {
        await assert.rejects(
            service.addEmployee(dbArray[0]),
            EmployeeAlreadyExistsError
        );
    });

    await it("On new employee w/o id -> return employee with generated ID", async () => {
        const addedEmployee = await service.addEmployee(newEmployee);
        assert.ok(addedEmployee.id);
    });

    await it("On new employee with id -> return employee with the same ID", async () => {
        const employeeToAdd = {...newEmployee, id: "100"};
        const addedEmployee = await service.addEmployee(employeeToAdd);
        assert.deepStrictEqual(addedEmployee, employeeToAdd);
    });

    await it("On new employee -> return added employee", async () => {
        const addedEmployee = await service.addEmployee(newEmployee);
        assert.deepStrictEqual(_.omit(addedEmployee, "id"), newEmployee);
    });

    await it("On new employee -> new employee available with get", async () => {
        const addedEmployee = await service.addEmployee(newEmployee);
        const employeeFromService = await service.getEmployee(addedEmployee.id!);
        assert.deepStrictEqual(employeeFromService, addedEmployee);
    });
});

async function testUpdateEmployee(id: string, baseEmployee: Employee, updEmployee: Partial<Employee>) {
    const expected: Employee = {...baseEmployee, ...updEmployee};

    const updated = await service.updateEmployee(id, updEmployee);
    assert.deepStrictEqual(updated, expected);

    const received = await service.getEmployee(id);
    assert.deepStrictEqual(received, expected);
}

describe(
    "Test updateEmployee method", async ()=> {
    await it("On non-existent id -> throw EmployeeNotFoundError", async ()=> {
        await assert.rejects(
            service.updateEmployee("10000000000", newEmployee),
            EmployeeNotFoundError,
        );
    });
    await it("Update single field correctly - department", async ()=> {
        const id = e1.id!;
        const fields = _.pick(newEmployee, "department");

        await testUpdateEmployee(id, e1, fields);
    });

    await it("Update single field correctly - salary", async ()=> {
        const id = e1.id!;
        const fields = _.pick(newEmployee, "salary");

        await testUpdateEmployee(id, e1, fields);
    });

    await it("Update all profile fields at once correctly", async ()=> {
        const id = e1.id!;

        await testUpdateEmployee(id, e1, newEmployee);
    })
});

describe("Test getAll with filters", async () => {
    await it("No filters -> return all employees", async () => {
        const provided = await service.getAll();
        compareArrays(provided, dbArray);
    });
    await it("If result set is too big -> throw QueryLimitExceededError", async () => {
        for (const e of dbArray) {
            await service.addEmployee(_.omit(e, "id"));
        }
        await assert.rejects(
            service.getAll(),
            QueryLimitExceededError,
        );
        for (const e of dbArray) {
            await service.deleteEmployee(e.id!);
        }
    })
    await it("Filter by department", async () => {
        const department = "IT";
        const options: EmployeeRequestParams = {department};

        const provided = await service.getAll(options);
        const expected = [e3, e4, e5];

        compareArrays(provided, expected);
    });
    await it("Filter by salary", async () => {
        const salary_gte = 25_000, salary_lte = 80_000;
        const options = {salary_lte, salary_gte};

        const provided = await service.getAll(options);
        const expected = [e1, e3];

        compareArrays(provided, expected);
    });
    await it("Filter by birthDate", async () => {
        const birthDate_gte = "1992-01-01", birthDate_lte = "2002-01-01";
        const options = {birthDate_gte, birthDate_lte};

        const provided = await service.getAll(options);
        const expected = [e1, e2];

        compareArrays(provided, expected);
    });
    await it("Filter by department, salary and birthDate", async () => {
        const department = "IT";
        const salary_gte = 70_000, salary_lte = 90_000;
        const birthDate_gte = "1982-01-01", birthDate_lte = "1982-10-10";
        const options = {department, salary_gte, salary_lte, birthDate_gte, birthDate_lte};

        const provided = await service.getAll(options);
        const expected = [e3];

        compareArrays(provided, expected);
    });
    await it("Filter by department, birthDate with empty result set", async()=>{
        const department = "IT";
        const birthDate_gte = "2000-01-01";
        const options = {department, birthDate_gte};

        const provided = await service.getAll(options);
        const expected: Employee[] = [];

        compareArrays(provided, expected);
    });
});