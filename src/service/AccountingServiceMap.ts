import type LoginData from "../model/LoginData.ts";
import type Account from "../model/Account.ts";
import type LoginResponse from "../model/LoginResponse.ts";
import type AccountingService from "./AccountingService.ts";
import {AuthenticationError} from "../model/Errors.ts";
import {compareSync} from "bcryptjs";
import JWTUtils from "../security/JWTUtils.ts";

export class AccountingServiceMap implements AccountingService{
    private accounts: Map<string, Account> = new Map();

    constructor() {
        this.accounts.set("admin@admin.com", {
            username: "admin@admin.com",
            role: "ADMIN",
            password: "$2y$10$SIrs2kAgLH7sHm3GhiuekeVzpBEjpPGsI4W9jhGsRuCZ3xGc5Y/gm"
        });
        this.accounts.set("user@user.com", {
            username: "user@user.com",
            role: "USER",
            password: "$2y$10$cXcZwFOXWWMnvvXLBRkDs.EThDOAQH7N3JMS.AmvcY0LYWSsucEAe"
        });
    }

    login(loginData: LoginData): LoginResponse {
        const account = this.accounts.get(loginData.email);
        if (!account || !compareSync(loginData.password, account.password)) {
            throw new AuthenticationError("Wrong credentials");
        }
        return {
            accessToken: JWTUtils.getJWT(account),
            user: {
                email: account.username,
                id: account.role
            }
        };
    }
}