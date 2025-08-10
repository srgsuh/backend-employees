import jwt from "jsonwebtoken";
import Account from "../model/Account.ts";

export default class JWTUtils {
    static getJWT(account: Account): string {
        return jwt.sign({
            role: account.role,
        }, process.env.JWT_SECRET!, {
            subject: account.username,
            expiresIn: "30d",
        });
    }

    static verifyJWT(token: string): jwt.JwtPayload {
        return jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    }
}