import EmployeesService from "./EmployeeService.ts";
import {readFileSync, writeFileSync} from "node:fs";
import z, {ZodType} from "zod";
import {validationError} from "../utils/zod-utils.ts";
import {Employee} from "../model/Employee.ts";
import {employeeSchemaLoad} from "../schemas/employees.schema.ts";
import {ValidationError} from "../model/Errors.js";


interface FileOptions {
    path?: string;
    encoding?: BufferEncoding;
}

class EmployeeLoader {
    path: string;
    encoding: BufferEncoding;

    constructor(
        private readonly schema: ZodType<Employee, any>,
        {
            path = "",
            encoding = "utf-8",
        }: FileOptions
    ) {
        this.path = path;
        this.encoding = encoding;
    }

    load(service: EmployeesService) {
        const rawData = this._readFile();
        if (rawData) {
            const parsedJSON = JSON.parse(rawData);
            if (!Array.isArray(parsedJSON)) {
                throw new ValidationError("Cannot load DB file - content must represent an array of employees");
            }
            let okCount = 0, totalCount = 0;
            parsedJSON.forEach( (item: unknown) => {
                okCount += this._addEmployee(item, service)? 1: 0;
                totalCount++;
            });
            console.log(`DB loading from ${this.path} completed. Loaded ${okCount} employees of ${totalCount}.`);
        }
    }

    save(service: EmployeesService) {
        if (this.path) {
            const writeData = JSON.stringify(service.getAll(), null, 2);
            writeFileSync(this.path, writeData, {encoding: this.encoding, flag: "w"});
            console.log(`DB saved to ${this.path}`);
        }
    }


    _readFile() {
        if (this.path) {
            try {
                return readFileSync(this.path, {flag: "r", encoding: this.encoding}).toString();
            }
            catch (e) {
                const fsError: NodeJS.ErrnoException = e as NodeJS.ErrnoException;
                if (fsError.code === "ENOENT") {
                    console.error(`File not found: ${this.path}`);
                }
                else {
                    throw e;
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
            const msg = (e instanceof z.ZodError)? validationError(e).message: e;
            console.error(`Error adding employee: ${msg}`);
        }
        return false;
    }
}

export default new EmployeeLoader(employeeSchemaLoad, {path: process.env.DB_FILE_PATH});
