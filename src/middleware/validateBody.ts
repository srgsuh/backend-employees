import z from "zod";
import {Request, Response, NextFunction} from "express";
import {validationError} from "../utils/zod-utils.js";

export default function<T extends z.ZodTypeAny>(schema: T) {
    return function (req: Request, _: Response, next: NextFunction) {
        req.body = schema.parse(req.body);
        next();
    }
}
