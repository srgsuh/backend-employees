import type EmployeeService from "./EmployeeService.js";

type Factory<T> = (deps: any) => Promise<T>;

const employeeRegistry: Map<string, Factory<EmployeeService>> = new Map();

export function registerEmployeeService(key: string, factory: Factory<EmployeeService>): void {
    if (employeeRegistry.has(key)) {
        throw new Error(`Employee service ${key} already registered`);
    }
    employeeRegistry.set(key, factory);
}

export function createEmployeeService(key: string, deps: any = {}): Promise<EmployeeService> {
    const factory = employeeRegistry.get(key);
    if (!factory) {
        throw new Error(`Employee service ${key} not found. Registered services: ${listEmployeeServices().join(',')}`);
    }
    return factory(deps);
}

export function listEmployeeServices(): string[] {
    return [...employeeRegistry.keys()];
}