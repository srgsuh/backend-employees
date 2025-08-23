export interface Initializable {
    onInitialize(): Promise<void>;
}

export function isInitializable(obj: unknown): obj is Initializable {
    return !!obj && typeof obj === "object" &&
        "onInitialize" in obj &&
        typeof (obj as Initializable).onInitialize === "function";
}

export interface Closable {
    onClose(): Promise<void>;
}

export function isCloseable(obj: unknown): obj is Closable {
    return !!obj && typeof obj === "object" &&
        "onClose" in obj &&
        typeof (obj as Closable).onClose === "function";
}