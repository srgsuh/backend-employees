import 'dotenv/config';

import cors from "cors";
import express from "express";
import morgan from "morgan";
import {errorHandler} from "./middleware/errorHandler.ts";
import {defaultHandler} from "./middleware/defaultHandler.ts";
import {parseGetQuery} from "./middleware/parseGetQuery.ts";
import service from "./service/EmployeeServiceMap.ts";
import loader from "./service/EmployeeLoader.ts";
import {EmployeeController} from "./controller/EmployeeController.ts";
import validateBody from "./middleware/validateBody.js";
import {employeeSchemaUpdate, employeeSchemaAdd} from "./schemas/employees.schema.js";
import {createWriteStream} from "node:fs";
import path from "node:path";

const DEFAULT_PORT = 3000;
const DEFAULT_MORGAN_FORMAT = 'dev';
const MORGAN_SKIP_THRESHOLD = 400;
const LOG_DIR = './logs';

const port = process.env.PORT || DEFAULT_PORT;

const morganFormat = process.env.MORGAN_FORMAT ?? DEFAULT_MORGAN_FORMAT;
const morganSkip = +(process.env.MORGAN_SKIP ?? MORGAN_SKIP_THRESHOLD);
const morganFile = process.env.MORGAN_FILE;
const logDir = process.env.LOG_DIR ?? LOG_DIR;

const employeeController = new EmployeeController(service);


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan(morganFormat, {skip: (__, res) => res.statusCode < morganSkip}));
morganFile && app.use(morgan('combined', {stream: createWriteStream(path.join(logDir, morganFile), {flags: 'a'})}));

app.get("/employees", parseGetQuery, employeeController.getAll);
app.get("/employees/:id", employeeController.getEmployee);
app.delete("/employees/:id", employeeController.deleteEmployee);
app.post("/employees", validateBody(employeeSchemaAdd), employeeController.addEmployee);
app.patch("/employees/:id", validateBody(employeeSchemaUpdate), employeeController.updateEmployee);

app.use(defaultHandler);
app.use(errorHandler);

const server = app.listen(port, (error) => {
    error? console.error(error): console.log(`Server started on port ${port}`);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
    server.close(() => {
        console.log("All connections are closed. Saving DB...");
        loader.save(service);
        console.log("DB saved. Server is closed.");
    });
}