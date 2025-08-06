import "express";
import {SearchObject} from "../src/service/EmployeeService.ts";

declare global {
  namespace Express {
    interface Request {
      searchObject?: SearchObject;
    }
  }
}