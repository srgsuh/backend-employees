import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import {errorHandler} from "../middleware/errorHandler.ts";

const DEFAULT_PORT = 3000;
const port = process.env.PORT || DEFAULT_PORT;

const app = express();
//TODO required middleware
app.use(express.json());
app.use(morgan('tiny'));

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

//Getting all employees
app.get("...", (req, res) => {
    //TODO
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