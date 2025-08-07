import z from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const dateErrorMessages = "Invalid date format. Expected yyyy-mm-dd";

export const searchRequestSchema = z.object({
    department: z.string().optional(),
    salary_gte: z.coerce.number().optional(),
    salary_lte: z.coerce.number().optional(),
    birthDate_gte: z.string().regex(dateRegex, { message: dateErrorMessages }).optional(),
    birthDate_lte: z.string().regex(dateRegex, { message: dateErrorMessages }).optional(),
});

export type SearchRequest = z.infer<typeof searchRequestSchema>;