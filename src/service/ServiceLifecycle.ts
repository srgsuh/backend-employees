export interface Initializable {
    init(): Promise<void>;
}

export function isInitializable(obj: unknown): obj is Initializable {
    return !!obj && typeof obj === "object" &&
        "init" in obj &&
        typeof (obj as Initializable).init === "function";
}

export interface Closeable {
    close(): Promise<void>;
}

export function isCloseable(obj: unknown): obj is Closeable {
    return !!obj && typeof obj === "object" &&
        "close" in obj &&
        typeof (obj as Closeable).close === "function";
}