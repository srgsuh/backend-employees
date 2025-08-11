import {AccountingService} from "./AccountingService.ts";
import LoginData from "../model/LoginData.ts";
import Account from "../model/Account.ts";
import {compareSync} from "bcryptjs";
import JWTUtils from "../security/JWTUtils.ts";
import {AuthenticationError} from "../model/Errors.js";

class AccountingServiceMap implements AccountingService{
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

    login(loginData: LoginData): string {
        const account = this.accounts.get(loginData.email);
        if (!account || !compareSync(loginData.password, account.password)) {
            throw new AuthenticationError("Wrong credentials");
        }
        return JWTUtils.getJWT(account);
    }
}

const accountingServiceMap = new AccountingServiceMap();
export default accountingServiceMap;