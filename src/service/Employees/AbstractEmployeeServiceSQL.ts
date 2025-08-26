import {Knex} from "knex";
import {Employee} from "../../model/Employee.ts";
import type EmployeeRequestParams from "../../model/EmployeeRequestParams.ts";
import type {WhereOptions, OrderByOptions} from "../../model/EmployeeRequestParams.ts";
import type EmployeeService from "./EmployeeService.ts";
import {EmployeeAlreadyExistsError, EmployeeNotFoundError, QueryLimitExceededError} from "../../model/Errors.ts";
import {v1 as nextId} from "uuid";
import _ from "lodash";
import {getEnvIntVariable} from "../../utils/env-utils.ts";
import {KnexDatabase} from "../KnexDatabase.ts";
import {splitOptions} from "../../utils/request-param-utils.ts";

const ROWS_LIMIT = 1000;
const rowsLimit = getEnvIntVariable("ROWS_LIMIT", ROWS_LIMIT);

export const TABLE_NAME = "employees";
const cId: keyof Employee = "id";
const cFullName: keyof Employee = "fullName";
const cDepartment: keyof Employee = "department";
const cBirthDate: keyof Employee = "birthDate";
const cSalary: keyof Employee = "salary";
const cAvatar: keyof Employee = "avatar";

const columns = [cId, cFullName, cDepartment, cBirthDate, cSalary, cAvatar];

type Operators = "<=" | ">=" | "=";
type WhereClauseData = {column: string, operator: Operators};
const parameterMapper: Record<keyof WhereOptions, WhereClauseData> = {
    department: {column: cDepartment, operator: "="},
    salary_gte: {column: cSalary, operator: ">="},
    salary_lte: {column: cSalary, operator: "<="},
    birthDate_gte: {column: cBirthDate, operator: ">="},
    birthDate_lte: {column: cBirthDate, operator: "<="},
}

export default abstract class AbstractEmployeeServiceSQL implements EmployeeService {
    protected constructor(private readonly _db: KnexDatabase) {}

    protected get db() {
        return this._db.dataBase;
    }

    async createTable() {
        if (!await this.db.schema.hasTable(TABLE_NAME)) {
            await this.db.schema.createTable(TABLE_NAME, (table) => {
                table.string(cId).primary();
                table.string(cFullName);
                table.string(cDepartment);
                table.string(cBirthDate);
                table.integer(cSalary);
                table.string(cAvatar).defaultTo("");
                table.index([cDepartment]);
                table.index([cBirthDate]);
                table.index([cSalary]);
            });
        }
    }

    async getAll(options: EmployeeRequestParams = {}) {
        const count = await this._count(options);
        if(count > this.maxRows) {
            throw new QueryLimitExceededError(count, this.maxRows);
        }
       return await this._getAll(options);
    }

    async getEmployee(id: string): Promise<Employee> {
        const e = await this._findById(id);
        if (!e) {
            throw new EmployeeNotFoundError(id);
        }
        return e;
    }

    async addEmployee(employee: Employee): Promise<Employee> {
        const newEmployee = employee.id? employee: {...employee, id: this._generateId()};
        try {
            await this.db(TABLE_NAME).insert(newEmployee);
        } catch (e) {
            throw new EmployeeAlreadyExistsError(newEmployee.id!);
        }
        return newEmployee;
    }

    async deleteEmployee(id: string): Promise<Employee> {
        const e = await this.getEmployee(id);
        await this.db(TABLE_NAME).where({id}).del();
        return e;
    }

    async updateEmployee(id: string, fields: Partial<Employee>): Promise<Employee> {
        const res = await this.db(TABLE_NAME).where({id}).update(fields);
        if (res === 0) {
            throw new EmployeeNotFoundError(id);
        }
        return this.getEmployee(id);
    }

    get maxRows(): number {
        return rowsLimit;
    }

    private async _getAll(options: EmployeeRequestParams) {
        const query = this.db.table<Employee>(TABLE_NAME);
        this._buildRequestCriteria(query, options);
        return query;
    }

    protected async _count(options: EmployeeRequestParams): Promise<number> {
        const query = this.db.table(TABLE_NAME).count<{"count": number}[]>({count: "id"});
        this._buildWhereClause(query, splitOptions(options).whereOptions);
        const result =  await query;
        return result[0].count;
    }

    protected _buildRequestCriteria(query: Knex.QueryBuilder, options: EmployeeRequestParams): void {
        const {whereOptions, orderByOptions} = splitOptions(options);
        this._buildWhereClause(query, whereOptions);
        this._buildOrderByClause(query, orderByOptions);
    }

    protected _buildWhereClause(query: Knex.QueryBuilder, options: WhereOptions): void {
        _.toPairs(options)
            .map(([key, value]):[WhereClauseData, string | number] =>
                [parameterMapper[key as keyof WhereOptions], value])
            .forEach(([mapped, value]) => {
                query.where(mapped.column, mapped.operator, value);
            })
        query.orderBy(cId);
    }

    protected _buildOrderByClause(query: Knex.QueryBuilder, {order_by}: OrderByOptions): void {
        order_by?.split(",")
            .map(s=> this._splitOrderInstruction(s.trim()))
            .filter(o => columns.includes(o.column as keyof Employee))
            .forEach(o => {
                query.orderBy(o.column, o.direction);
            });
    }

    protected _splitOrderInstruction(order: string): { column: string, direction: "asc" | "desc" } {
        if (order.startsWith("-") || order.startsWith("+")) {
            return {
                column: order.substring(1),
                direction: order[0] === "-"? "desc": "asc"
            };
        }
        return {column: order, direction: "asc"};
    }

    protected async _findById(id: string) {
        const query = this.db.select<Employee>().from(TABLE_NAME).where({id});
        return query.first();
    }

    protected _generateId(): string {
        return nextId();
    }
}