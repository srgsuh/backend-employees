import z, {literal} from 'zod';
import {getAgeFromDate} from "../utils/date-utils.ts";
import LIMITS from "../model/default-values.ts";

// No validation for salary bounds and maxAge on existing employees - historical values might not fit the limits
export const employeeSchemaLoad = z.strictObject({
    id: z.guid(),
    fullName: z.string().min(4).max(255),
    department: z.union(LIMITS.departments.map(d => literal(d)), {
        error: "Invalid department. Expected one of: " + LIMITS.departments.join(",")
    }),
    avatar: z.union([
        z.url({protocol: /^https?$/,hostname: z.regexes.domain}),
        z.literal(""),
    ]),
    salary: z.coerce.number().int().positive(),
    birthDate: z.iso.date({abort: true})
        .refine(
            d => getAgeFromDate(d) >= LIMITS.minAge
            , {message: `Age must not be less then ${LIMITS.minAge}`}
        ),
});

export const employeeSchemaAdd = employeeSchemaLoad.extend({
    salary: z.coerce.number().int().min(LIMITS.minSalary).max(LIMITS.maxSalary),
    birthDate: z.iso.date({abort: true})
        .refine(
            d => getAgeFromDate(d) >= LIMITS.minAge
            , {message: `Age must not be less then ${LIMITS.minAge}`}
        )
        .refine(
            d => getAgeFromDate(d) <= LIMITS.maxAge
            , {message: `Age must not be greater then ${LIMITS.maxAge}`}
        ),
}).partial({id: true});

export const employeeSchemaUpdate = employeeSchemaAdd.partial();

