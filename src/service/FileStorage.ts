import {prettifyError, ZodType} from "zod";
import {readFileSync, writeFileSync} from "node:fs";

export class FileStorage<T>{
    constructor(private readonly schema: ZodType<T, any>,
                private readonly path?: string,
                private readonly encoding: BufferEncoding = "utf-8"
    ) {}

    save(data: T[]): void {
        if (this.path) {
            const writeData = JSON.stringify(data, null, 2);
            writeFileSync(this.path, writeData, {encoding: this.encoding, flag: "w"});
        }
    }

    load(consumer: (item: T) => void): void {
        const rawData = this._readFileSync();
        if (rawData) {
            const parsedJSON = JSON.parse(rawData);
            const parsedArray = Array.isArray(parsedJSON) ? parsedJSON : [parsedJSON];
            parsedArray.forEach(item => this._supply(item, consumer));
        }
    }

    private _readFileSync(): string {
        if (this.path) {
            try {
                return readFileSync(this.path, {flag: "r", encoding: this.encoding}).toString();
            } catch (e) {
                const fsError: NodeJS.ErrnoException = e as NodeJS.ErrnoException;
                if (fsError.code === "ENOENT") {
                    return "";
                }
                throw e;
            }
        }
        return "";
    }

    private _supply(item: unknown, consumer: (item: T) => void): void {
        const {success, data, error} = this.schema.safeParse(item);
        if (success) {
            consumer(this.schema.parse(data));
        }
        else {
            console.error(`Error parsing item: ${prettifyError(error)}`);
        }
    }
}