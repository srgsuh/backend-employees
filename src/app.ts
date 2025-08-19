import cors from "cors";
import express from "express";
import morgan from "morgan";
import {errorHandler} from "./middleware/errorHandler.ts";
import {defaultHandler} from "./middleware/defaultHandler.ts";
import {createWriteStream} from "node:fs";
import path from "node:path";
import {getEnvBoolVariable, getEnvIntVariable, getEnvVariable} from "./utils/env-utils.ts";
import employeeRouter from "./routes/employees-router.ts";
import loginRouter from "./routes/login-router.ts";
import {authenticate} from "./middleware/auth/authenticate.ts";

const DEFAULT_MORGAN_FORMAT = 'dev';
const DEFAULT_MORGAN_SKIP_THRESHOLD = 400;
const DEFAULT_LOG_DIR = './logs';
const morganFormat = getEnvVariable("MORGAN_FORMAT", DEFAULT_MORGAN_FORMAT);
const morganSkip = getEnvIntVariable("MORGAN_SKIP", DEFAULT_MORGAN_SKIP_THRESHOLD);
const morganFile = process.env.MORGAN_FILE;
const logDir = getEnvVariable("LOG_DIR", DEFAULT_LOG_DIR);
const morganOff= getEnvBoolVariable("MORGAN_OFF", false);

const app = express();

app.use(cors());
if (!morganOff) {
    app.use(morgan(morganFormat, {skip: (__, res) => res.statusCode < morganSkip}));
    morganFile && app.use(morgan('combined', {stream: createWriteStream(path.join(logDir, morganFile), {flags: 'a'})}));
}
app.use("/employees", authenticate);

app.use(express.json());
app.use("/employees", employeeRouter);
app.use("/login", loginRouter);

app.use(defaultHandler);
app.use(errorHandler);

export default app;

