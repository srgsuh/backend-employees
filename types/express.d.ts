import "express";
import {SearchObject} from "../src/service/Employees/EmployeeService.ts";

declare global {
  namespace Express {
    interface Request {
      searchObject?: SearchObject;
      username?: string;
      role?: string;
    }
  }
}