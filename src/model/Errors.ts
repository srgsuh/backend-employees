
export class ValidationError extends Error {
    name = "ValidationError";
}

export class HttpError extends Error {
    name = "HttpError";
    constructor(message: string, public statusCode: number, options?: ErrorOptions) {
        super(message, options);
    }
}

export class AuthenticationError extends HttpError {
    name = "AuthenticationError";
    constructor(message: string = "Authentication is required to access this resource", options?: ErrorOptions) {
        super(message, 401, options);
    }
}

export class AuthorizationError extends HttpError {
    name = "AuthorizationError";
    constructor(message: string = "You do not have permission to access this resource", options?: ErrorOptions) {
        super(message, 403, options);
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

export class AccountAlreadyExistsError extends HttpError {
    name = "AccountAlreadyExistsError";
    constructor(email: string) {
        super(`Account with email=${email} already exists`, 409);
    }
}