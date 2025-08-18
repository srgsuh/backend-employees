import {Employee} from "../model/Employee.ts";

export type Matcher = {
    isEqual: boolean,
    message: string,
}

export function matchKey<T>(e1: T, e2: T, key: keyof T): Matcher {
    const isEqual = e1[key] === e2[key];
    const message = isEqual? "": `property ${String(key)} doesn't match: ${e1[key]} !== ${e2[key]}`;
    return {isEqual, message};
}

export function matchKeys<T>(e1: T, e2: T, keys: (keyof T)[]) {
    const message = keys
        .map(key => matchKey(e1, e2, key).message)
        .filter(message => message !== "")
        .join("; ");
    return {isEqual: message === "", message};
}

export function matchId(e1: Employee, e2: Employee) {
    return matchKey<Employee>(e1, e2, "id");
}

export function matchProfile(e1: Employee, e2: Employee) {
    return matchKeys<Employee>(e1, e2, ["fullName", "birthDate", "department", "salary", "avatar"]);
}

export function matchAll(e1: Employee, e2: Employee) {
    return matchKeys<Employee>(e1, e2, ["id", "fullName", "birthDate", "department", "salary", "avatar"]);
}

export function compareArraysByIds(a1: Employee[], a2: Employee[]): boolean {
    const normalize = (a: Employee[])=>a.map(e=>e.id).sort();
    return normalize(a1).join(",") === normalize(a2).join(",");
}