import z from "zod";
import {NextFunction, Request, Response} from "express";
import _ from "lodash";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const dateErrorMessages = "Invalid date format. Expected yyyy-mm-dd";

const searchRequestSchema = z.object({
    department: z.string().optional(),
    salary_gte: z.coerce.number().optional(),
    salary_lte: z.coerce.number().optional(),
    birthDate_gte: z.string().regex(dateRegex, { message: dateErrorMessages }).optional(),
    birthDate_lte: z.string().regex(dateRegex, { message: dateErrorMessages }).optional(),
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
            req.searchObject = _.omitBy(baseObject, _.isNil);
        }
        next();
    } catch (e) {
        const error = (e instanceof z.ZodError)? parseZodError(e): e;
        next(error);
    }
}

function parseZodError(e: z.ZodError) {
    const message = e.issues.map(issue => {
        return `Error in ${issue.path.join(', ')}. ${issue.message}`;
    }).join("; ");
    return new Error(message);
}