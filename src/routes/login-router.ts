import {Router} from "express";
import { AuthController } from '../controller/AuthController.ts';
import accountingService from "../service/AccountingServiceMap.ts";
import validateBody from "../middleware/validateBody.ts";
import {loginSchema} from "../schemas/login.schema.ts";

const authController = new AuthController(accountingService);

const loginRouter = Router();

loginRouter.post("/", validateBody(loginSchema), authController.login);

export default loginRouter;