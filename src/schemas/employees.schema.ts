import z, {literal} from 'zod';
import {getAgeFromDate} from "../utils/date-utils.ts";
import {EmployeeLimits} from "../model/config-values.ts";

const {minAge, maxAge, minSalary, maxSalary, departments} = EmployeeLimits;

// No validation for salary bounds and maxAge on existing employees - historical values might not fit the limits
export const employeeSchemaLoad = z.strictObject({
    id: z.guid(),
    fullName: z.string().min(4).max(255),
    department: z.union(departments.map(d => literal(d)), {
        error: "Invalid department. Expected one of: " + departments.join(",")
    }),
    avatar: z.union([
        z.url({protocol: /^https?$/,hostname: z.regexes.domain}),
        z.literal(""),
    ]),
    salary: z.coerce.number().int().positive(),
    birthDate: z.iso.date({abort: true})
        .refine(
            d => getAgeFromDate(d) >= minAge
            , {message: `Age must not be less then ${minAge}`}
        ),
});

export const employeeSchemaAdd = employeeSchemaLoad.extend({
    salary: z.coerce.number().int().min(minSalary).max(maxSalary),
    birthDate: z.iso.date({abort: true})
        .refine(
            d => getAgeFromDate(d) >= minAge
            , {message: `Age must not be less then ${minAge}`}
        )
        .refine(
            d => getAgeFromDate(d) <= maxAge
            , {message: `Age must not be greater then ${maxAge}`}
        ),
}).strip().partial({id: true});
export const employeeSchemaUpdate = employeeSchemaAdd.partial();

