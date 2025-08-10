import z from "zod";
import {NextFunction, Request, Response} from "express";
import _ from "lodash";
import {validationError} from "../utils/zod-utils.ts";
import {searchRequestSchema} from "../schemas/get-query-parameters.schema.ts";

export function parseGetQuery(req: Request, __: Response, next: NextFunction) {
    try {
        const query = req.query;
        if (query && !_.isEmpty(query)) {
            req.searchObject = searchRequestSchema.parse(query);
        }
        next();
    } catch (e) {
        next(e instanceof z.ZodError? validationError(e): e);
    }
}