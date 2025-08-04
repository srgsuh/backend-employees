import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import {errorHandler} from "./middleware/errorHandler.ts";
import EmployeesServiceMap from "./service/EmployeeServiceMap.ts";
import EmployeesService from "./service/EmployeeService.ts";
import {defaultHandler} from "./middleware/defaultHandler.ts";
import {EmployeeController} from "./controller/EmployeeController.ts";

const DEFAULT_PORT = 3000;
const port = process.env.PORT || DEFAULT_PORT;
const morganFormat = process.env.NODE_ENV === "production"? 'tiny': 'dev';

console.log("NODE_ENV=", process.env.NODE_ENV);

const employeesService: EmployeesService = new EmployeesServiceMap();
const employeeController = new EmployeeController(employeesService);

const app = express();

app.use(express.json());
app.use(morgan(morganFormat));

app.get("/employees", employeeController.getAll);
app.get("/employees/:id", employeeController.getEmployee);
app.post("/employees", employeeController.addEmployee);
app.delete("/employees/:id", employeeController.deleteEmployee);
app.patch("/employees/:id", employeeController.updateEmployee);

app.use(defaultHandler);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});