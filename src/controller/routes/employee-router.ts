import express from "express";
import service from "../../service/EmployeeServiceMap.ts";
import {EmployeeController} from "../EmployeeController.ts";
import {authorize} from "../../middleware/auth/authorize.ts";
import {authenticate} from "../../middleware/auth/authenticate.ts";
import { parseGetQuery } from "../../middleware/parseGetQuery.ts";
import validateBody from "../../middleware/validateBody.ts";
import { employeeSchemaAdd, employeeSchemaUpdate } from "../../schemas/employees.schema.ts";

const employeeController = new EmployeeController(service);
const employeeRouter = express.Router();

employeeRouter.use("/employees", authenticate);
const [authorizeAdmin, authorizeAll] = [authorize(new Set<string>(["ADMIN"])), authorize(new Set<string>([ "ADMIN", "USER"]))];
employeeRouter.get("/employees", authorizeAll, parseGetQuery, employeeController.getAll);
employeeRouter.get("/employees/:id", authorizeAll, employeeController.getEmployee);
employeeRouter.delete("/employees/:id", authorizeAdmin, employeeController.deleteEmployee);
employeeRouter.post("/employees", authorizeAdmin, validateBody(employeeSchemaAdd), employeeController.addEmployee);
employeeRouter.patch("/employees/:id", authorizeAdmin, validateBody(employeeSchemaUpdate), employeeController.updateEmployee);

export default employeeRouter;