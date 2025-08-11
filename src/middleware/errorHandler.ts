import {Request, Response, NextFunction} from "express";
import {EmployeeAlreadyExistsError, EmployeeNotFoundError} from "../service/EmployeeServiceErrors.ts";
import {parseZodError} from "../utils/zod-utils.ts";
import {ZodError, prettifyError} from "zod";

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
    let status = 400;

    if (error instanceof EmployeeAlreadyExistsError) {
        status = 409;
    }
    else if (error instanceof EmployeeNotFoundError) {
        status = 404;
    }

    const message = error instanceof ZodError? prettifyError(error) :error.message;

    res.status(status).json({error: message});
}