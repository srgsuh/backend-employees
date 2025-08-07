import 'dotenv/config';
import cors from "cors";
import express from "express";
import morgan from "morgan";
import {errorHandler} from "./middleware/errorHandler.ts";
import EmployeesServiceMap from "./service/EmployeeServiceMap.ts";
import EmployeesService from "./service/EmployeeService.ts";
import {defaultHandler} from "./middleware/defaultHandler.ts";
import {EmployeeController} from "./controller/EmployeeController.ts";
import {parseGetQuery} from "./middleware/parseGetQuery.js";

const DEFAULT_PORT = 3000;
const port = process.env.PORT || DEFAULT_PORT;
const defaultMorganFormat = process.env.NODE_ENV === "production"? 'tiny': 'dev';
const morganFormat = process.env.MORGAN_FORMAT ?? defaultMorganFormat

const employeesService: EmployeesService = new EmployeesServiceMap();
const employeeController = new EmployeeController(employeesService);

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan(morganFormat));

app.get("/employees", parseGetQuery, employeeController.getAll);
app.get("/employees/:id", employeeController.getEmployee);
app.post("/employees", employeeController.addEmployee);
app.delete("/employees/:id", employeeController.deleteEmployee);
app.patch("/employees/:id", employeeController.updateEmployee);

app.use(defaultHandler);
app.use(errorHandler);

const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
    server.close(() => console.log("Server closed"));
}