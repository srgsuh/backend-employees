export default interface Persistable {
    save(): void;
    load(): void;
}

export function isPersistable(obj: any): obj is Persistable {
    return typeof obj === "object" &&
    "save" in obj && typeof obj.save === "function" &&
    "load" in obj && typeof obj.load === "function";
}