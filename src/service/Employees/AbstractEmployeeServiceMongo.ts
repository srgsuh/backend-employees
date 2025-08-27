import { type Employee } from "../../model/Employee.ts";
import type EmployeeService from "./EmployeeService.ts";
import EmployeeRequestParams, {WhereOptions} from "../../model/EmployeeRequestParams.ts";
import {Collection, Db, MongoClient, MongoServerError, WithId} from "mongodb";
import type {Filter} from "mongodb";
import {Closable, Initializable} from "../ServiceLifecycle.ts";
import {EmployeeAlreadyExistsError, EmployeeNotFoundError} from "../../model/Errors.ts";
import {v1 as nextId} from "uuid";
import _ from "lodash";
import {splitOptions} from "../../utils/request-param-utils.js";

type whereOp = "$gte" | "$lte" | "$eq";
const WhereMapper: Record<keyof WhereOptions, {field: keyof Employee, op: whereOp}> = {
    department: {field: "department", op: "$eq"},
    salary_gte: {field: "salary", op: "$gte"},
    salary_lte: {field: "salary", op: "$lte"},
    birthDate_gte: {field: "birthDate", op: "$gte"},
    birthDate_lte: {field: "birthDate", op: "$lte"},
}

export default abstract class AbstractEmployeeServiceMongo
    implements EmployeeService, Initializable, Closable {
    client: MongoClient;
    db!: Db;
    collection!: Collection<Employee>;

    protected constructor(uri: string, private dbName: string , private collectionName: string) {
        this.client = new MongoClient(uri);
    }

    async onClose(): Promise<void> {
        await this.client.close();
    }

    async onInitialize(): Promise<void> {
        await this.client.connect();
        this.db = this.client.db(this.dbName);
        this.collection = this.db.collection<Employee>(this.collectionName);
        await this.collection.createIndex({id: 1}, {unique: true});
        await this.collection.createIndex({department: "hashed"});
        await this.collection.createIndex({salary: 1});
        await this.collection.createIndex({birthDate: 1});
    }

    async getAll(options: EmployeeRequestParams = {}): Promise<Employee[]> {
        const filter = this.getFilter(options);
        console.log("getAll filter = ", JSON.stringify(filter, null, 2));
        return this.collection.find(filter).project<Employee>({_id: 0}).toArray();
    }

    private getFilter(requestParams: EmployeeRequestParams): Filter<Employee> {
       let filter: Filter<Employee> = {};
       const {whereOptions} = splitOptions(requestParams);
       if (!_.isEmpty(whereOptions)) {
           const partials: Filter<Employee>[] = _.toPairs(whereOptions).map(
               ([key, value]) => {
                   const {field, op} = WhereMapper[key as keyof WhereOptions];
                   return {[field]: {[op]: value}};
               });
           filter = (partials.length === 1)? partials[0]: {$and: partials};
       }
       return filter;
    }

    async getEmployee(id: string): Promise<Employee> {
        const e = await this.collection.findOne<Employee>({id}, { projection: { _id: 0 }});
        if (!e) {
            throw new EmployeeNotFoundError(id);
        }
        return e;
    }

    async addEmployee(employee: Employee): Promise<Employee> {
        const id = employee.id ?? this._genId();
        const newEmployee = {...employee, id};
        try {
            await this.collection.insertOne(newEmployee, {forceServerObjectId: true});
            return newEmployee;
        } catch (e) {
            throw isDuplicateKeyError(e)? new EmployeeAlreadyExistsError(id): e;
        }
    }

    async deleteEmployee(id: string): Promise<Employee> {
        const result = await this.collection
            .findOneAndDelete({id}, { projection: { _id: 0 }});
        if (!result) {
            throw new EmployeeNotFoundError(id);
        }
        return result;
    }

    async updateEmployee(id: string, fields: Partial<Employee>): Promise<Employee> {
        const result = await this.collection.findOneAndUpdate(
            {id},
            { $set: fields },
            { returnDocument: "after", projection: { _id: 0 } },
        );
        if (!result) {
            throw new EmployeeNotFoundError(id);
        }
        return result;
    }

    private _genId(): string {
        return nextId();
    }
}

export function isDuplicateKeyError(err: unknown): err is MongoServerError {
    return (
        err instanceof MongoServerError &&
        (err as MongoServerError).code === 11000
    );
}