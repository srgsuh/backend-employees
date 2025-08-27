import AbstractEmployeeServiceMongo from "./AbstractEmployeeServiceMongo.ts";
import {Closable, Initializable} from "../ServiceLifecycle.js";
import {MongoMemoryServer} from "mongodb-memory-server";

const DB_NAME = "employees_db";
const COLLECTION_NAME = "employees";

export class EmployeeServiceMongoInMemory extends AbstractEmployeeServiceMongo
    implements Initializable, Closable{

    constructor(private memoryServer: MongoMemoryServer) {
        super(memoryServer.getUri(), DB_NAME, COLLECTION_NAME);
    }

    async onInitialize(): Promise<void> {
        await super.onInitialize();
    }

    async onClose(): Promise<void> {
        await super.onClose();
        await this.memoryServer.stop();
    }
}