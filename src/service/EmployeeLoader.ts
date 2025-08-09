import EmployeesService from "./EmployeeService.ts";
import {readFileSync, writeFileSync} from "node:fs";
import z, {ZodType} from "zod";
import {validationError} from "../utils/zod-utils.ts";
import {Employee} from "../model/Employee.ts";
import {employeeSchemaLoad} from "../schemas/employees.schema.ts";

export interface LoaderOptions {
    path?: string,
    throwOnNoFile?: boolean,
    throwOnEmployeeError?: boolean,
}

interface EmployeeLoaderOptions {
    path?: string;
    throwSuppressed?: boolean;
    throwOnNoFile?: boolean;
    throwOnIndividualError?: boolean;
    encoding?: BufferEncoding;
}

type ErrorHandler = (e: Error) => void;
const throwIt: ErrorHandler = (e) => {throw e};
const logIt: ErrorHandler = (e) => console.error(e);
type ErrorHandlerMap = Record<string, ErrorHandler>;

class EmployeeLoader {
    path: string;
    errorMap: ErrorHandlerMap;
    encoding: BufferEncoding;

    constructor(
        private readonly schema: ZodType<Employee, any>,
        {
            path = "",
            throwSuppressed = false,
            throwOnNoFile = false,
            throwOnIndividualError = false,
            encoding = "utf-8",
        }: EmployeeLoaderOptions
    ) {
        this.path = path;
        this.encoding = encoding;
        if (throwSuppressed) {
            [throwOnNoFile, throwOnIndividualError] = [false, false];
        }
        this.errorMap = {
            "no_file": throwOnNoFile? throwIt: logIt,
            "individual": throwOnIndividualError? throwIt: logIt,
            "default": throwSuppressed? logIt: throwIt,
        };
    }

    load(service: EmployeesService) {
        const rawData = this._readFile();
        if (rawData) {
            const parsedJSON = JSON.parse(rawData);
            if (this._checkIsArray(parsedJSON)) {
                let okCount = 0, totalCount = 0;
                parsedJSON.forEach( (item: unknown) => {
                    okCount += this._addEmployee(item, service)? 1: 0;
                    totalCount++;
                });
                console.log(`DB loading from ${this.path} completed. Loaded ${okCount} employees of ${totalCount}.`);
            }
        }
    }

    save(service: EmployeesService) {
        if (this.path) {
            const writeData = JSON.stringify(service.getAll(), null, 2);
            writeFileSync(this.path, writeData, {encoding: this.encoding, flag: "w"});
        }
    }

    _checkIsArray(e: unknown) {
        if (!Array.isArray(e)) {
            this.errorMap["default"](new Error("Cannot load DB file - content must represent an array of employees"));
            return false;
        }
        return true;
    }

    _readFile() {
        if (this.path) {
            try {
                return readFileSync(this.path, {flag: "r", encoding: this.encoding}).toString();
            }
            catch (e) {
                const fsError: NodeJS.ErrnoException = e as NodeJS.ErrnoException;
                if (fsError.code === "ENOENT") {
                    this.errorMap["no_file"](new Error(`File not found: ${this.path}`, {cause: fsError}));
                }
                else {
                    this.errorMap["default"](new Error(`Error reading file: ${this.path}`, {cause: fsError}));
                }
            }
        }
        return null;
    }

    private _addEmployee(e: unknown, service: EmployeesService) {
        try {
            service.addEmployee(this.schema.parse(e));
            return true;
        }
        catch (e: unknown) {
            const error = this._prettifyError(e);
            this.errorMap["individual"](error);
        }
        return false;
    }

    private _prettifyError(e: unknown) {
        let outputError: Error;
        if (e instanceof z.ZodError) {
            outputError = validationError(e);
        }
        else if (e instanceof Error) {
            outputError = e;
        }
        else {
            outputError = new Error(`Unknown error: ${e}`, {cause: e});
        }
        return outputError;
    }
}

export default new EmployeeLoader(employeeSchemaLoad, {
    path: process.env.DB_FILE_PATH,
    throwSuppressed: process.env.DB_LOAD_SUPRESS_ERRORS === "true",
    throwOnNoFile: process.env.DB_LOAD_THROW_ON_NO_FILE === "true",
    throwOnIndividualError: process.env.DB_LOAD_THROW_ON_EACH === "true",
});
