import EmployeesService from "./EmployeeService.ts";
import { employeeArraySchema, EmployeeArraySchemaType, EmployeeFull } from "../schemas/employees.schema.ts";
import {readFileSync, writeFileSync} from "node:fs";
import {writeFile} from "node:fs/promises";
import employeeServiceMap from "./EmployeeServiceMap.ts";
import z from "zod";
import {validationError} from "../utils/zod-utils.ts";
import {EmployeeServiceError} from "./EmployeeServiceErrors.ts";

export interface LoaderOptions {
    path?: string,
    ignoreMissingFile?: boolean,
    ignoreServiceErrors?: boolean,
}

class EmployeeLoader {
    constructor(
        private service: EmployeesService,
        private schema: EmployeeArraySchemaType
    ) {}

    loadData(
        {path = "", ignoreMissingFile = true, ignoreServiceErrors = true}: LoaderOptions
    ): void {
        if (!path) {
            return;
        }
        try {
            const rawData = readFileSync(path, {flag: "r"});
            const parsed = this.schema.parse(JSON.parse(rawData.toString()));
            parsed.forEach(e => this._addEmployee(e, ignoreServiceErrors));
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

    async saveDataAsync(path: string = ""): Promise<void> {
        if (path) {
            const employees = this.service.getAll();
            const writeData = JSON.stringify(employees, null, 2);
            await writeFile(path, writeData, {encoding: "utf-8", flag: "w"});
        }
    }

    saveData(path: string = "") {
        if (!path) {
            return;
        }
        const employees = this.service.getAll();
        const writeData = JSON.stringify(employees, null, 2);
        writeFileSync(path, writeData, {encoding: "utf-8", flag: "w"});
    }

    private _addEmployee(e: EmployeeFull, ignoreErrors: boolean) {
        try {
            this.service.addEmployee(e);
        }
        catch (e) {
            if (ignoreErrors && e instanceof EmployeeServiceError) {
                console.error(e.message);
                return;
            }
            throw e;
        }
    }
}

const employeeLoader = new EmployeeLoader(employeeServiceMap, employeeArraySchema);
export default employeeLoader;