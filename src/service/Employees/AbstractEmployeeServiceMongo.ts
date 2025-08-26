import { type Employee } from "../../model/Employee.ts";
import type EmployeeService from "./EmployeeService.ts";
import EmployeeRequestParams from "../../model/EmployeeRequestParams.ts";
import {Collection, Db, MongoClient, MongoServerError, WithId} from "mongodb";
import {Closable, Initializable} from "../ServiceLifecycle.ts";
import {EmployeeAlreadyExistsError, EmployeeNotFoundError} from "../../model/Errors.ts";
import {v1 as nextId} from "uuid";
import _ from "lodash";

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

    async getAll(options?: EmployeeRequestParams): Promise<Employee[]> {
        const filter = options?.department? {department: options.department}: {};
        return this.collection.find(filter).project<Employee>({_id: 0}).toArray();
    }

    async getEmployee(id: string): Promise<Employee> {
        const e = await this.collection
            .findOne<Employee>({id}, { projection: { _id: 0 }});
        if (!e) {
            throw new EmployeeNotFoundError(id);
        }
        return e;
    }

    async addEmployee(employee: Employee): Promise<Employee> {
        employee.id = employee.id ?? this._genId();
        try {
            const result =
                await this.collection.insertOne(employee, {forceServerObjectId: true});
            console.dir("Inserted value: ", result);
        } catch (e) {
            throw isDuplicateKeyError(e)? new EmployeeAlreadyExistsError(employee.id): e;
        }
        return employee;
    }

    async deleteEmployee(id: string): Promise<Employee> {
        const result = await this.collection
            .findOneAndDelete({id}, { projection: { _id: 0 }});
        if (!result) {
            throw new EmployeeNotFoundError(id);
        }
        return stripId(result);
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

export function stripId(e: WithId<Employee>): Employee {
    return _.omit(e, "_id");
}