import {JsonWebTokenError, JwtPayload, sign, verify} from "jsonwebtoken";
import Account from "../model/Account.ts";
import {AuthorizationError} from "../model/Errors.js";

export default class JWTUtils {
    static getJWT(account: Account): string {
        return sign({
            role: account.role,
        }, process.env.JWT_SECRET!, {
            subject: account.username,
            expiresIn: "30d",
        });
    }

    static verifyJWT(token: string): JwtPayload {
        try {
            return verify(token, process.env.JWT_SECRET!) as JwtPayload;
        }
        catch (e) {
            throw (e instanceof JsonWebTokenError) ?
                new AuthorizationError(e.message, {cause: e}) : e;
        }
    }
}