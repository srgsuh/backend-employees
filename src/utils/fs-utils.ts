import {createWriteStream} from "node:fs";
import {readFileSync} from "node:fs";
import {ZodType} from "zod";

export function writeToFile<T>(path: string, data: Iterable<T>) {
    const stream = createWriteStream(path, {encoding: "utf-8", flags: "w"});
    stream.write("[");
    for (const item of data) {
        if (stream.bytesWritten > 1) {
            stream.write(",");
        }
        stream.write(JSON.stringify(item));
    }
    stream.write("]");
    stream.end();
}

export function readFromFile<T>(path: string, schema: ZodType<T, any>): T | null {
    const data = readFileSync(path, {encoding: "utf-8"});
    if (data) {
        const parsedData = JSON.parse(data);
        return schema.parse(parsedData);
    }
    return null;
}