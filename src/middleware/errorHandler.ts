import {Request, Response, NextFunction} from "express";
import {HttpError} from "../model/Errors.ts";
import {ZodError, prettifyError} from "zod";

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
    const status = error instanceof HttpError? error.statusCode: 400;
    const message = error instanceof ZodError? prettifyError(error) :error.message;

    res.status(status).json({error: message});
}