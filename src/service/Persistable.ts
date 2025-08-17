export default interface Persistable {
    save(): Promise<void>;
    load(): void;
}

export function isPersistable(obj: unknown): obj is Persistable {
    return !!obj && typeof obj === "object" &&
    "save" in obj && typeof (obj as Persistable).save === "function" &&
    "load" in obj && typeof (obj as Persistable).load === "function";
}