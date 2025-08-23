import type LoginData from "../../model/LoginData.ts";
import type Account from "../../model/Account.ts";
import type LoginResponse from "../../model/LoginResponse.ts";
import type AccountingService from "./AccountingService.ts";
import {AccountAlreadyExistsError, AuthenticationError} from "../../model/Errors.ts";
import {compare, hash} from "bcryptjs";
import JWTUtils from "../../security/JWTUtils.ts";
import {StorageProvider} from "../StorageProvider.ts";
import {Closable} from "../ServiceLifecycle.ts";

export class AccountingServiceMap implements AccountingService, Closable{
    private accounts: Map<string, Account> = new Map();

    constructor(private readonly storage: StorageProvider<Account>) {
        this.load();
    }

    async login(loginData: LoginData): Promise<LoginResponse> {
        const account = this.accounts.get(loginData.email);
        const compareOk = account && await compare(loginData.password, account.password);
        if (!compareOk) {
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

    async addAccount(loginData: LoginData): Promise<void> {
        const username = loginData.email;
        if (this.accounts.has(username)) {
            throw new AccountAlreadyExistsError(username);
        }
        const password = await hash(loginData.password, 10);
        const account: Account = {
            username,
            password,
            role: "USER",
        };
        this.accounts.set(username, account);
    }

    loadAccount(account: Account) {
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
        this.storage.load((a) => this.loadAccount(a));
        console.log(`AccountingServiceMap: ${this.accounts.size} accounts loaded from DB file`);
    }
}