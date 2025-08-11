import {EmployeeServiceError} from "../service/EmployeeServiceErrors.js";

export class ValidationError extends Error {
    name = "ValidationError";
}

export class HttpError extends Error {
    name = "HttpError";
    constructor(message: string, public readonly statusCode: number) {
        super(message);
    }
}

export class AuthenticationError extends HttpError {
    name = "AuthenticationError";
    constructor(message: string = "Authentication is required to access this resource") {
        super(message, 401);
    }
}

export class AuthorizationError extends HttpError {
    name = "AuthorizationError";
    constructor(message: string = "You do not have permission to access this resource") {
        super(message, 403);
    }
}

export class EmployeeAlreadyExistsError extends HttpError {
    name = "EmployeeAlreadyExistsError";
    constructor(id: string) {
        super(`Employee with id=${id} already exists`, 409);
    }
}

export class EmployeeNotFoundError extends HttpError {
    name = "EmployeeNotFoundError";
    constructor(id: string) {
        super(`Employee with id=${id} not found`, 404);
    }
}