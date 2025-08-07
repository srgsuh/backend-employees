import {createWriteStream, createReadStream} from "node:fs";
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

export async function readFromFile<T>(path: string, schema: ZodType<T, any>): Promise<T | null> {
    const stream = createReadStream(path, {encoding: "utf-8"});
    let data = "";
    for await (const chunk of stream) {
    data += chunk;
    }
    stream.close();
    if (data) {
        const parsedData = JSON.parse(data);
        return schema.parse(parsedData);
    }
    return null;
}