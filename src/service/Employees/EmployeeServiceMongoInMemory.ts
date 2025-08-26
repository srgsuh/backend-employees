import AbstractEmployeeServiceMongo from "./AbstractEmployeeServiceMongo.ts";
import {Closable, Initializable} from "../ServiceLifecycle.js";
import {MongoMemoryServer} from "mongodb-memory-server";

const DB_NAME = "employees_db";
const COLLECTION_NAME = "employees";

export class EmployeeServiceMongoInMemory extends AbstractEmployeeServiceMongo
    implements Initializable, Closable{
    private mongoMemoryServer: MongoMemoryServer;

    constructor() {
        const server = new MongoMemoryServer();
        super(server.getUri(), DB_NAME, COLLECTION_NAME);
        this.mongoMemoryServer = server;
    }

    async onInitialize(): Promise<void> {
        await super.onInitialize();
    }

    async onClose(): Promise<void> {
        await super.onClose();
        await this.mongoMemoryServer.stop();
    }
}