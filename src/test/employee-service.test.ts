import {employeeService as service} from "../service/bootstrap.ts";
import {beforeEach, describe, it} from "node:test";
import assert from "node:assert";
import {
    EmployeeAlreadyExistsError,
    EmployeeNotFoundError,
} from "../model/Errors.ts";
import {matchAll, matchProfile, compareArraysByIds} from "../utils/match-utils.ts";
import {Employee} from "../model/Employee.ts";
import EmployeeRequestParams from "../model/EmployeeRequestParams.ts";

const newEmployee = {
    fullName: "John",
    department: "IT",
    avatar: "",
    salary: 85_000,
    birthDate: "1982-10-01"
}

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

beforeEach(async () => {
    const array = await service.getAll();
    for (const e of array) {
        await service.deleteEmployee(e.id!);
    }
    for (const e of dbArray) {
        await service.addEmployee(e);
    }
});

describe("Test getAll method without parameters", async () => {
    await it("Method provides correct number of employees", async () => {
        const array = await service.getAll();
        assert.equal(array.length, dbArray.length, `Method returns wrong number of employees: ${array.length} !==${dbArray.length}`);
    });
    await it("Method provides all employees", async () => {
        const array = await service.getAll();
        dbArray.forEach(dbEmployee => {
            const employeeFromService = array.find(
                item => item.id === dbEmployee.id
            );
            assert.ok(employeeFromService, `Employee id = ${dbEmployee.id} not found!`);
            const {isEqual, message} = matchAll(dbEmployee, employeeFromService);
            assert.ok(isEqual, message);
        });
    });
});

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
        const {isEqual, message} = matchAll(employee, employeeFromService);
        assert.ok(isEqual, message);
    });
})

describe("Test deleteEmployee method", async () => {
    await it("On non-existent id -> throw EmployeeNotFoundError", async () => {
        await assert.rejects(
            service.deleteEmployee("10000000000"),
            EmployeeNotFoundError
        )
    });

    await it("On existing id -> delete correct employee", async () => {
        const employee = dbArray[1];
        const deletedEmployee = await service.deleteEmployee(employee.id!);

        const {isEqual, message} = matchAll(employee, deletedEmployee);
        assert.ok(isEqual, message);

        await assert.rejects(
            service.getEmployee(employee.id!),
            EmployeeNotFoundError,
            "Employee still exists after deletion"
        );
    });
});

describe("Test addEmployee(employee) method", async () => {
    await it("On existing id -> throw EmployeeAlreadyExistsError", async () => {
        await assert.rejects(
            service.addEmployee(dbArray[0]),
            EmployeeAlreadyExistsError
        );
    });

    await it("On not existing employee -> add with new ID", async () => {
        const addedEmployee = await service.addEmployee(newEmployee);
        const addedId = addedEmployee.id;
        assert.ok(addedId, "Successfully generated ID");
        const employeeFromService = await service.getEmployee(addedId);
        const {isEqual, message} = matchProfile(newEmployee, employeeFromService);
        assert.ok(isEqual, message);
    });
});

describe("Test getAll with filters", async () => {
    await it("Filter by department", async () => {
        const department = "IT";
        const options: EmployeeRequestParams = {department};
        const array = await service.getAll(options);
        const expected = [e3, e4, e5];
        assert.ok(compareArraysByIds(array, expected));
    });
    await it("Filter by salary", async () => {
       const salary_gte = 25_000, salary_lte = 80_000;
       const options = {salary_lte, salary_gte};
        const array = await service.getAll(options);
        const expected = [e3, e1];
        assert.ok(compareArraysByIds(array, expected));
    });
    await it("Filter by birthDate", async () => {
        const birthDate_gte = "1992-01-01", birthDate_lte = "2002-01-01";
        const options = {birthDate_gte, birthDate_lte};
        const array = await service.getAll(options);
        const expected = [e1, e2];
        assert.ok(compareArraysByIds(array, expected));
    });
    await it("Filter by department, salary and birthDate", async () => {
        const department = "IT";
        const salary_gte = 70_000, salary_lte = 90_000;
        const birthDate_gte = "1982-01-01", birthDate_lte = "1982-10-10";
        const options = {department, salary_gte, salary_lte, birthDate_gte, birthDate_lte};
        const array = await service.getAll(options);
        const expected = [e3];
        assert.ok(compareArraysByIds(array, expected));
    });
    await it("Filter by department, birthDate with empty result set", async()=>{
        const department = "IT";
        const birthDate_gte = "2000-01-01";
        const options = {department, birthDate_gte};
        const array = await service.getAll(options);
        const expected: Employee[] = [];
        assert.ok(compareArraysByIds(array, expected));
    });
});