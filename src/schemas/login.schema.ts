import z from "zod";

export const loginSchema = z.strictObject({
    email: z.email({pattern: z.regexes.html5Email}),
    password: z.string()
});