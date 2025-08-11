import { Request, Response, NextFunction, RequestHandler} from "express";
import { AuthenticationError, AuthorizationError } from "../../model/Errors.ts";

export function authorize(roles: string[]): RequestHandler {
    return function(req: Request, _: Response, next: NextFunction): void {
        if (!req.role) {
            throw new AuthenticationError();
        }
        if (!roles.includes(req.role)) {
            throw new AuthorizationError();
        }
        next();
    }
}