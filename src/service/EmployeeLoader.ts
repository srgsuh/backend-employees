import EmployeesService from "./EmployeeService.ts";
import {readFileSync, writeFileSync} from "node:fs";
import z, {ZodType} from "zod";
import {validationError} from "../utils/zod-utils.ts";
import {Employee} from "../model/Employee.js";
import {ValidationError} from "../model/Errors.js";

export interface LoaderOptions {
    path?: string,
    throwOnNoFile?: boolean,
    throwOnEmployeeError?: boolean,
}

export function loadData(
    service: EmployeesService,
    schema: ZodType<Employee, any>,
    {path = "", throwOnNoFile = false, throwOnEmployeeError = false}: LoaderOptions
){
    if (!path) {
        return;
    }
    try {
        const rawData = readFileSync(path, {flag: "r"});
        const parsedData = JSON.parse(rawData.toString());
        _checkIsArray(parsedData);
        parsedData.forEach((item: unknown) => _addEmployee(service, schema, item, !throwOnEmployeeError));
    }
    catch (e) {
        const error: NodeJS.ErrnoException = e as NodeJS.ErrnoException;
        if (error.code === "ENOENT") {
            _throwOrIgnore(error, !throwOnNoFile);
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

function _checkIsArray(parsedData: unknown) {
    if (!Array.isArray(parsedData)) {
        throw new ValidationError("Data in DB file is not an array");
    }
}

function _addEmployee(
    service: EmployeesService,
    schema: ZodType<Employee, any>,
    item: unknown,
    ignoreError: boolean
) {
    try {
        const employee = schema.parse(item);
        service.addEmployee(employee);
    }
    catch (e: unknown) {
        const error = (e instanceof z.ZodError)? validationError(e): e;
        _throwOrIgnore(error, ignoreError);
    }
}

function _throwOrIgnore(e: unknown, ignoreError: boolean) {
    if (ignoreError) {
        console.error(e);
    }
    else {
        throw e;
    }
}