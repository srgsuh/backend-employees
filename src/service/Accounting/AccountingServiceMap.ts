import type LoginData from "../../model/LoginData.ts";
import type Account from "../../model/Account.ts";
import type LoginResponse from "../../model/LoginResponse.ts";
import type AccountingService from "./AccountingService.ts";
import {AccountAlreadyExistsError, AuthenticationError} from "../../model/Errors.ts";
import {compareSync} from "bcryptjs";
import JWTUtils from "../../security/JWTUtils.ts";
import {StorageProvider} from "../StorageProvider.ts";
import {Closable} from "../ServiceLifecycle.ts";

export class AccountingServiceMap implements AccountingService, Closable{
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

    async onClose(): Promise<void> {
        const accounts = [...this.accounts.values()];
        this.storage.save(accounts);
        console.log(`AccountingServiceMap: ${accounts.length} accounts saved to file`);
    }

    private load() {
        this.storage.load((a) => this.addAccount(a));
        console.log(`AccountingServiceMap: ${this.accounts.size} accounts loaded from DB file`);
    }
}