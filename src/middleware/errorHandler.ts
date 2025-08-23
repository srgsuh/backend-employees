import {Request, Response, NextFunction} from "express";
import {HttpError} from "../model/Errors.ts";
import {ZodError, prettifyError} from "zod";

type ResponseObject = {
    error: string;
    status: number;
}

type ErrorHandler ={
    test: (e: unknown) => boolean;
    createResponse: (e: unknown) => ResponseObject;
}
const handlers: ErrorHandler[] = [
    {
        test: (e: unknown) => e instanceof HttpError,
        createResponse: (e: unknown) => ({error: (e as HttpError).message, status: (e as HttpError).statusCode})
    },
    {
        test: (e: unknown) => e instanceof ZodError,
        createResponse: (e: unknown) => ({error: prettifyError(e as ZodError), status: 400})
    },
    {
        test: (e: unknown) => e instanceof SyntaxError && "status" in e && e.status === 400 && "body" in e,
        createResponse: (e: unknown) => ({error: "Invalid JSON payload", status: 400})
    }
];
const defaultHandler = {
    test: () => true,
    createResponse: (e: unknown) => (
        {error: "Internal server error: " + (e instanceof Error? e.message: `${e}`), status: 500})
}

export function errorHandler(e: unknown, _req: Request, res: Response, _next: NextFunction) {
    const handler = handlers.find(h => h.test(e)) || defaultHandler;
    const {status, error} = handler.createResponse(e);
    res.status(status).json({error});
}