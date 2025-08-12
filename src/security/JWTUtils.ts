import jwt from "jsonwebtoken";
import Account from "../model/Account.ts";
import {AuthenticationError,} from "../model/Errors.ts";

export interface JWTPayload {
    role: string;
    sub: string;
}

export function isJWTPayload(obj: unknown): obj is JWTPayload {
    return !!obj && typeof obj === "object" && "role" in obj && "sub" in obj;
}

export default class JWTUtils {
    static getJWT(account: Account): string {
        return jwt.sign({
            role: account.role,
        }, process.env.JWT_SECRET!, {
            subject: account.username,
            expiresIn: "30d",
        });
    }

    static verifyJWT(token: string): jwt.JwtPayload | string {
        try {
            return jwt.verify(token, process.env.JWT_SECRET!);
        }
        catch (e) {
            throw (e instanceof jwt.JsonWebTokenError) ?
                new AuthenticationError(e.message, {cause: e}) : e;
        }
    }
}