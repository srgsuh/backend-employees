import 'dotenv/config';

import cors from "cors";
import express, {Request, Response} from "express";
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
import accountingService from "./service/AccountingServiceMap.ts";
import {authorize} from "./middleware/auth/authorize.ts";
import {authenticate} from "./middleware/auth/authenticate.ts";

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

app.use("/employees", authenticate);

const [authorizeAdmin, authorizeAll] = [authorize(["ADMIN"]), authorize([ "ADMIN", "USER"])];

app.get("/employees", authorizeAll, parseGetQuery, employeeController.getAll);
app.get("/employees/:id", authorizeAll, employeeController.getEmployee);
app.delete("/employees/:id", authorizeAdmin, employeeController.deleteEmployee);
app.post("/employees", authorizeAdmin, validateBody(employeeSchemaAdd), employeeController.addEmployee);
app.patch("/employees/:id", authorizeAdmin, validateBody(employeeSchemaUpdate), employeeController.updateEmployee);

app.post("/login", (req: Request, res: Response) => {
    const token = accountingService.login(req.body);
    res.json({token});
});

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