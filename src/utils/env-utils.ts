import z from "zod";

export function getEnvVariable(name: string, defaultValue: string): string {
    const {success, data} = z.string().min(1).safeParse(process.env[name]);
    return success? data: defaultValue;
}

export function getEnvIntVariable(name: string, defaultValue: number): number {
    const {success, data} = z.coerce.number().int().safeParse(process.env[name]);
    return success? data: defaultValue;
}

export function getEnvBoolVariable(name: string, defaultValue: boolean): boolean {
    const {success, data} = z.coerce.boolean().safeParse(process.env[name]);
    return success? data: defaultValue;
}

export function getEnvStrArray(name: string, defaultValue: string[]) {
    const {success, data} = z.array(z.string().min(1)).safeParse(
        process.env[name]?.split(",").map(s => s.trim())
    );
    return success ? data : defaultValue;
}