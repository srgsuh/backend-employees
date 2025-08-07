import z from 'zod';

export const employeesFullSchema = z.object({
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

export const employeeCreateSchema = employeesFullSchema.partial({id: true});

export const employeeArraySchema = z.array(employeesFullSchema);

export type EmployeeFull = z.infer<typeof employeesFullSchema>;
export type EmployeeCreate = z.infer<typeof employeeCreateSchema>;
export type EmployeeArray = z.infer<typeof employeeArraySchema>;