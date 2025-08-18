import { NextFunction, Request, Response } from "express";
import {AuthenticationError } from "../../model/Errors.ts";

export function authErrorHandler(err: unknown, _req: Request, _res: Response, _next: NextFunction) {
    if (err instanceof AuthenticationError) {
        throw err;
    }
    throw AuthenticationError.from(err);
}