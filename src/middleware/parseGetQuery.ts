import z from "zod";
import {NextFunction, Request, Response} from "express";
import _ from "lodash";

const searchRequestSchema = z.object({
    department: z.string().optional(),
    salary_gte: z.number().optional(),
    salary_lte: z.number().optional(),
    birthDate_gte: z.string().optional(),
    birthDate_lte: z.string().optional(),
});

type SearchRequest = z.infer<typeof searchRequestSchema>;

export function parseGetQuery(req: Request, res: Response, next: NextFunction) {
    try {
        const query = req.query;
        if (query && !_.isEmpty(query)) {
            const searchRequest: SearchRequest = searchRequestSchema.parse(query);
            const baseObject = {
                department: searchRequest.department,
                salaryFrom: searchRequest.salary_gte,
                salaryTo: searchRequest.salary_lte,
                birthDateFrom: searchRequest.birthDate_gte,
                birthDateTo: searchRequest.birthDate_lte,
            }
            const searchObject = _.omitBy(baseObject, _.isNil);
            if (_.isEmpty(searchObject)) {
                req.searchObject = searchObject;
            }
        }
        next();
    } catch (e) {
        next(e);
    }
}