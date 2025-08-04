import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import {errorHandler} from "../middleware/errorHandler.ts";
import EmployeesServiceMap from "../service/EmployeeServiceMap.ts";
import EmployeesService from "../service/EmployeeService.ts";
import {defaultHandler} from "../middleware/defaultHandler.ts";

const DEFAULT_PORT = 3000;
const port = process.env.PORT || DEFAULT_PORT;

const employeesService: EmployeesService = new EmployeesServiceMap();

const app = express();

app.use(express.json());
app.use(morgan('tiny'));

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


app.get("/employees", (req, res) => {
    const employees = employeesService.getAll();
    res.json(employees);
});

app.get("/employees/:id", (req, res) => {
    const id = req.params.id;
    const employee = employeesService.get(id);
    res.json(employee);
});

app.post("/employees",(req, res) => {
    const employee = employeesService.add(req.body);
    res.json(employee);
});

app.delete("/employees/:id",(req, res) => {
    const id = req.params.id;
    const employee = employeesService.delete(id);
    res.json(employee);
});

app.patch("/employees/:id",(req, res) => {
    const updater = {
        id: req.params.id,
        fields: req.body,
    };
    const employee = employeesService.update(updater);
    res.json(employee);
});

app.use(defaultHandler);
app.use(errorHandler);