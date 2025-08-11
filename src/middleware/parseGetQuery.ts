import {NextFunction, Request, Response} from "express";
import _ from "lodash";
import {searchRequestSchema} from "../schemas/get-query-parameters.schema.ts";

export function parseGetQuery(req: Request, __: Response, next: NextFunction) {
    const query = req.query;
    if (query && !_.isEmpty(query)) {
        req.searchObject = searchRequestSchema.parse(query);
    }
    next();
}