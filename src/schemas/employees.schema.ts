import z from 'zod';

export const employeeFullSchema = z.object({
    id: z.guid(),
    salary: z.coerce.number().int().positive(),
    fullName: z.string().max(255),
    department: z.string().max(255),
    birthDate: z.iso.date(),
    avatar: z.union([
        z.url({protocol: /^https?$/,hostname: z.regexes.domain}),
        z.literal(""),
    ]),
});
export const employeeFullArraySchema = z.array(employeeFullSchema);

export const employeePartialSchema = employeeFullSchema.partial();

export const employeeStandardSchema = employeeFullSchema.partial({id: true});

