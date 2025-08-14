import {Router} from "express";
import {EmployeeController} from "../controller/EmployeeController.ts";
import {authorize} from "../middleware/auth/authorize.ts";
import { parseGetQuery } from "../middleware/parseGetQuery.ts";
import validateBody from "../middleware/validateBody.ts";
import { employeeSchemaAdd, employeeSchemaUpdate } from "../schemas/employees.schema.ts";
import { getEmployeeService } from "../service/services.ts";

const employeeService = getEmployeeService();
const employeeController = new EmployeeController(employeeService);

const authorizeAdmin = authorize(new Set<string>(["ADMIN"]));
const authorizeAll = authorize(new Set<string>([ "ADMIN", "USER"]));

const employeeRouter = Router();

employeeRouter.get("/", authorizeAll, parseGetQuery, employeeController.getAll);
employeeRouter.get("/:id", authorizeAll, employeeController.getEmployee);
employeeRouter.delete("/:id", authorizeAdmin, employeeController.deleteEmployee);
employeeRouter.post("/", authorizeAdmin, validateBody(employeeSchemaAdd), employeeController.addEmployee);
employeeRouter.patch("/:id", authorizeAdmin, validateBody(employeeSchemaUpdate), employeeController.updateEmployee);

export default employeeRouter;