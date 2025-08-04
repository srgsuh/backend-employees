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

const employeesService: EmployeesService = new EmployeesServiceMap();
const employeeController = new EmployeeController(employeesService);

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get("/employees", employeeController.getAll);
app.get("/employees/:id", employeeController.get);
app.post("/employees", employeeController.add);
app.delete("/employees/:id", employeeController.delete);
app.patch("/employees/:id", employeeController.update);

app.use(defaultHandler);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});