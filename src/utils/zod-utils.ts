import z from "zod";

export function parseZodError(e: z.ZodError): string {
    return e.issues.map(issue => {
        return `Error in ${issue.path.join(', ')}. ${issue.message}`;
    }).join("; ");
}

export function validationError(zError: z.ZodError): Error {
    return new Error(parseZodError(zError));
}