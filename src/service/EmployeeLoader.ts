import EmployeesService from "./EmployeeService.ts";
import {readFileSync, writeFileSync} from "node:fs";
import z, {ZodType} from "zod";
import {validationError} from "../utils/zod-utils.ts";
import {EmployeeServiceError} from "./EmployeeServiceErrors.ts";
import {Employee} from "../model/Employee.js";

export interface LoaderOptions {
    path?: string,
    ignoreMissingFile?: boolean,
    ignoreServiceErrors?: boolean,
}

export function loadData(
    service: EmployeesService,
    schema: ZodType<Employee[], any>,
    {path = "", ignoreMissingFile = true, ignoreServiceErrors = true}: LoaderOptions
){
    if (!path) {
        return;
    }
    try {
        const rawData = readFileSync(path, {flag: "r"});
        const parsed = schema.parse(JSON.parse(rawData.toString()));
        parsed.forEach(e => addEmployee(service, e, ignoreServiceErrors));
    }
    catch (e) {
        if (ignoreMissingFile && e instanceof Error && e.name === "ENOENT") {
            console.error(`File ${path} does not exist`);
            return;
        }
        if (e instanceof z.ZodError) {
            throw validationError(e);
        }
        throw e;
    }
}

export function saveData(service: EmployeesService, path: string = "") {
    if (path) {
        const writeData = JSON.stringify(service.getAll(), null, 2);
        writeFileSync(path, writeData, {encoding: "utf-8", flag: "w"});
    }
}

function addEmployee(service: EmployeesService, e: Employee, ignoreErrors: boolean) {
    try {
        service.addEmployee(e);
    }
    catch (e) {
        if (ignoreErrors && e instanceof EmployeeServiceError) {
            console.error(e.message);
            return;
        }
        throw e;
    }
}
