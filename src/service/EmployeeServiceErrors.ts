export class EmployeeServiceError extends Error {}

export class EmployeeAlreadyExistsError extends EmployeeServiceError {
    name = "EmployeeAlreadyExistsError";
    constructor(id: string) {
        super(`Employee with id=${id} already exists`);
    }
}

export class EmployeeNotFoundError extends EmployeeServiceError {
    name = "EmployeeNotFoundError";
    constructor(id: string) {
        super(`Employee with id=${id} not found`);
    }
}