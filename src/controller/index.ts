import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import {errorHandler} from "../middleware/errorHandler.ts";
import EmployeesServiceMap from "../service/EmployeeServiceMap.ts";

const DEFAULT_PORT = 3000;
const port = process.env.PORT || DEFAULT_PORT;

const employeesService = new EmployeesServiceMap();

const app = express();
//TODO required middleware
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
    const employees = employeesService.get(id);
    res.json(employees);
});
//Adding new employee
app.post("...",(req, res) => {
    //TODO
});
//deleting employee
app.delete("...",(req, res) => {
    //TODO
});
//Updating employee
app.patch("...",(req, res) => {
    //TODO
});

app.use(errorHandler);