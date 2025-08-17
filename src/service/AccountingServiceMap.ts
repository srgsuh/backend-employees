import type LoginData from "../model/LoginData.ts";
import type Account from "../model/Account.ts";
import type LoginResponse from "../model/LoginResponse.ts";
import type AccountingService from "./AccountingService.ts";
import {AccountAlreadyExistsError, AuthenticationError} from "../model/Errors.ts";
import {compareSync} from "bcryptjs";
import JWTUtils from "../security/JWTUtils.ts";
import Persistable from "./Persistable.ts";
import {StorageProvider} from "./StorageProvider.ts";

export class AccountingServiceMap implements AccountingService, Persistable{
    private accounts: Map<string, Account> = new Map();

    constructor(private readonly storage: StorageProvider<Account>) {
        this.load();
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

    addAccount(account: Account) {
        const username = account.username;
        if (this.accounts.has(username)) {
            throw new AccountAlreadyExistsError(username);
        }
        this.accounts.set(username, account);
    }

    async save(): Promise<void> {
        const accounts = [...this.accounts.values()];
        this.storage.save(accounts);
        console.log(`${accounts.length} accounts saved to file`);
    }

    load() {
        this.storage.load((a) => this.addAccount(a));
        console.log(`${this.accounts.size} accounts loaded from DB file`);
    }
}