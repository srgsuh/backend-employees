import {prettifyError, ZodError, ZodType} from "zod";
import {readFileSync, writeFileSync} from "node:fs";
import {existsSync} from "node:fs";

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
        if (!this.path || !existsSync(this.path)) {
            return;
        }
        const rawData =readFileSync(this.path, {flag: "r", encoding: this.encoding}).toString();
        const parsedJSON = JSON.parse(rawData);
        parsedJSON.forEach( (item: unknown) => this._supply(item, consumer));
    }

    private _supply(item: unknown, consumer: (item: T) => void): void {
        try {
            consumer(this.schema.parse(item));
        }
        catch (e) {
            const error = (e instanceof ZodError)? prettifyError(e): e;
            console.error(`Error parsing item: ${error}`);
        }
    }
}