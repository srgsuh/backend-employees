import { NextFunction, Request, Response } from "express";
import {AuthenticationError } from "../../model/Errors.ts";
import {ZodError} from "zod";

export function authErrorHandler(err: unknown, _req: Request, _res: Response, next: NextFunction) {
    next(err instanceof ZodError? AuthenticationError.from(err): err);
}