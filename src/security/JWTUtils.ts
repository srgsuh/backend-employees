import jwt from "jsonwebtoken";
import Account from "../model/Account.ts";
import {AuthenticationError,} from "../model/Errors.ts";
import {getEnvIntVariable} from "../utils/env-utils.js";

const {JWT_SECRET} = process.env;
const JWT_EXPIRES_IN_DEFAULT = 60 * 60 * 1000;

const JWT_EXPIRES_IN = getEnvIntVariable("JWT_EXPIRES_IN", JWT_EXPIRES_IN_DEFAULT);

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
        }, JWT_SECRET!, {
            subject: account.username,
            expiresIn: JWT_EXPIRES_IN,
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