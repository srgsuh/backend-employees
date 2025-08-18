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

export function matchProfile(e1: Partial<Employee>, e2: Partial<Employee>) {
    return matchKeys<Partial<Employee>>(e1, e2, ["fullName", "birthDate", "department", "salary", "avatar"]);
}

export function matchAll(e1: Partial<Employee>, e2: Partial<Employee>) {
    return matchKeys<Partial<Employee>>(e1, e2, ["id", "fullName", "birthDate", "department", "salary", "avatar"]);
}

export function matchEmployeeArrays(a1: Employee[], a2: Employee[]): Matcher {
    const idStr = (a: Employee[]) => a.map(e => e.id).sort().join(",");
    let message = "";
    if (a1.length !== a2.length) {
        message = `arrays have different length: ${a1.length} !== ${a2.length}`;
    }
    else {
        const idStr1 = idStr(a1);
        const idStr2 = idStr(a2);
        if (idStr1 !== idStr2) {
            message = `arrays contain different ids: ${idStr1} !== ${idStr2}`;
        }
    }
    return {isEqual: !message, message};
}
