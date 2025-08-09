import z, {literal} from 'zod';
import {getAgeFromDate} from "../utils/date-utils.ts";
import {EmployeeLimits, BASE_LIMITS} from "../model/EmployeeLimits.ts";

function createEmployeeSchema({minAge, maxAge, minSalary, maxSalary, departments}: EmployeeLimits) {
    return z.strictObject({
        id: z.guid(),
        salary: z.coerce.number().int().min(minSalary).max(maxSalary),
        fullName: z.string().min(4).max(255),
        department: z.union(departments.map(d => literal(d)), {
            error: "Invalid department. Expected one of: " + departments.join(",")
        }),
        birthDate: z.iso.date({abort: true})
            .refine(
                d => (!minAge || getAgeFromDate(d) >= minAge)
                , {message: `Age must not be less then ${minAge}`}
            )
            .refine(
                d => (!maxAge || getAgeFromDate(d) <= maxAge)
                , {message: `Age must not be greater then ${maxAge}`}
            ),
        avatar: z.union([
            z.url({protocol: /^https?$/,hostname: z.regexes.domain}),
            z.literal(""),
        ]),
    });
}

export const employeeSchemaLoadDB = createEmployeeSchema({...BASE_LIMITS, maxAge: 0});

export const employeeSchemaStandard = createEmployeeSchema(BASE_LIMITS).partial({id: true});

export const employeeSchemaPartial = employeeSchemaStandard.partial();

