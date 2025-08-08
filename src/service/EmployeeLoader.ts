import EmployeesService from "./EmployeeService.ts";
import {readFileSync, writeFileSync} from "node:fs";
import z, {ZodType} from "zod";
import {validationError} from "../utils/zod-utils.ts";
import {EmployeeServiceError} from "./EmployeeServiceErrors.ts";
import {Employee} from "../model/Employee.js";

export interface LoaderOptions {
    path?: string,
    throwOnNoFile?: boolean,
    throwOnEmployeeError?: boolean,
}

export function loadData(
    service: EmployeesService,
    schema: ZodType<Employee[], any>,
    {path = "", throwOnNoFile = false, throwOnEmployeeError = false}: LoaderOptions
){
    if (!path) {
        return;
    }
    try {
        const rawData = readFileSync(path, {flag: "r"});
        const parsed = schema.parse(JSON.parse(rawData.toString()));
        parsed.forEach(e => _addEmployee(service, e, !throwOnEmployeeError));
    }
    catch (e) {
        const error: NodeJS.ErrnoException = e as NodeJS.ErrnoException;
        if (!throwOnNoFile && error.code === "ENOENT") {
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

function _addEmployee(service: EmployeesService, e: Employee, ignoreError: boolean) {
    try {
        service.addEmployee(e);
    }
    catch (e) {
        if (ignoreError && e instanceof EmployeeServiceError) {
            console.error(e.message);
            return;
        }
        throw e;
    }
}
