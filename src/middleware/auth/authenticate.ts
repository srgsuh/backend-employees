import { Request, Response, NextFunction } from "express";
import JWTUtils, {isJWTPayload} from "../../security/JWTUtils.ts";

const PREFIX = "Bearer ";

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith(PREFIX)) {
        const token = authHeader.substring(PREFIX.length);
        const payload = JWTUtils.verifyJWT(token);
        if (payload && isJWTPayload(payload)) {
            req.username = payload.sub;
            req.role = payload.role;
        }
    }
    next();
}