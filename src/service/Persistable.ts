export default interface Persistable {
    save(): void;
}

export function isPersistable(obj: any): obj is Persistable {
    return typeof obj === "object" &&"save" in obj && typeof obj.save === "function";
}