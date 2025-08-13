import 'dotenv/config';

import cors from "cors";
import express from "express";
import morgan from "morgan";
import {errorHandler} from "./middleware/errorHandler.ts";
import {defaultHandler} from "./middleware/defaultHandler.ts";
import service from "./service/EmployeeServiceMap.ts";
import validateBody from "./middleware/validateBody.ts";
import {createWriteStream} from "node:fs";
import path from "node:path";
import accountingService from "./service/AccountingServiceMap.ts";
import {isPersistable} from "./service/Persistable.ts";
import {loginSchema} from "./schemas/login.schema.js";
import {AuthController} from "./controller/AuthController.js";
import {getEnvIntVariable, getEnvVariable} from "./utils/env-utils.js";
import employeeRouter from "./controller/routes/employee-router.ts";

const DEFAULT_PORT = 3000;
const DEFAULT_MORGAN_FORMAT = 'dev';
const DEFAULT_MORGAN_SKIP_THRESHOLD = 400;
const DEFAULT_LOG_DIR = './logs';

const port = getEnvIntVariable("PORT", DEFAULT_PORT);

const morganFormat = getEnvVariable("MORGAN_FORMAT", DEFAULT_MORGAN_FORMAT);
const morganSkip = getEnvIntVariable("MORGAN_SKIP", DEFAULT_MORGAN_SKIP_THRESHOLD);
const morganFile = process.env.MORGAN_FILE;
const logDir = getEnvVariable("LOG_DIR", DEFAULT_LOG_DIR);


const authController = new AuthController(accountingService);

const app = express();

app.use(cors());
app.use(morgan(morganFormat, {skip: (__, res) => res.statusCode < morganSkip}));
morganFile && app.use(morgan('combined', {stream: createWriteStream(path.join(logDir, morganFile), {flags: 'a'})}));

app.use("/employees", employeeRouter);
app.post("/login", validateBody(loginSchema), authController.login);

app.use(defaultHandler);
app.use(errorHandler);

const server = app.listen(port, (error) => {
    error? console.error(error): console.log(`Server started on port ${port}`);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
    server.close(() => {
        console.log("Server closed");
        if (isPersistable(service)) {
            service.save();
            console.log("DB saved");
        }
    });
}