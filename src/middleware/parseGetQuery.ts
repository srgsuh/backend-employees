import z from "zod";
import {NextFunction, Request, Response} from "express";
import _ from "lodash";
import {parseZodError} from "../utils/zod-utils.ts";
import {searchRequestSchema} from "../schemas/get-query-parameters.schema.ts";


export function parseGetQuery(req: Request, res: Response, next: NextFunction) {
    try {
        const query = req.query;
        if (query && !_.isEmpty(query)) {
            req.searchObject = searchRequestSchema.parse(query);
        }
        next();
    } catch (e) {
        const error = (e instanceof z.ZodError)? parseZodError(e): e;
        next(error);
    }
}