import z from "zod";
import {ROLES} from "../model/config-values.ts";

export const accountSchema = z.strictObject({
    username: z.email({pattern: z.regexes.html5Email}),
    password: z.string().min(1, {message: "Password is required"}),
    role: z.union(ROLES.map(r => z.literal(r)), {
        error: `Invalid role. Expected one of: ${ROLES?.join(", ")}`
    })
});