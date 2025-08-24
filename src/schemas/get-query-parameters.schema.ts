import z from "zod";

export const searchRequestSchema = z.strictObject({
    department: z.string().min(1).optional(),
    salary_gte: z.coerce.number().optional(),
    salary_lte: z.coerce.number().optional(),
    birthDate_gte: z.iso.date().optional(),
    birthDate_lte: z.iso.date().optional(),
    order_by: z.string().min(1).optional(),
});