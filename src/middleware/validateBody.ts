import z from "zod";
import {Request, Response, NextFunction, RequestHandler} from "express";

export function validateBody<T extends z.ZodTypeAny>(schema: T): RequestHandler {
    return function (req: Request, _: Response, next: NextFunction) {
        req.body = schema.parse(req.body);
        next();
    }
}
