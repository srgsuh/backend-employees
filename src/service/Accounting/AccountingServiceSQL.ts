import AccountingService from "./AccountingService.ts";
import LoginData from "../../model/LoginData.ts";
import LoginResponse from "../../model/LoginResponse.ts";
import {KnexDatabase} from "../KnexDatabase.ts";
import Account from "../../model/Account.ts";
import {AccountAlreadyExistsError, AuthenticationError} from "../../model/Errors.ts";
import JWTUtils from "../../security/JWTUtils.ts";
import {Initializable} from "../ServiceLifecycle.ts";
import HashProvider from "../../security/HashProvider.ts";

const accountTable = "accounts";

export class AccountingServiceSQL implements AccountingService, Initializable {
    constructor(
        private readonly _db: KnexDatabase,
        private readonly hashing: HashProvider,
    ) {}

    async createTable() {
        const isExists = await this.db.schema.hasTable(accountTable);
        if (isExists) return;
        await this.db.schema.createTable(accountTable, (table) => {
            table.string("username").primary();
            table.string("password");
            table.string("role");
        });
    }

    async login(loginData: LoginData): Promise<LoginResponse> {
        const account = await this._get(loginData.email);
        const compareOk = account &&
            await this.hashing.compare(loginData.password, account.password);
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
        const account = await this._get(loginData.email);
        if (account) {
            throw new AccountAlreadyExistsError(loginData.email);
        }
        const username = loginData.email;
        const password = await this.hashing.hash(loginData.password);
        await this.db(accountTable).insert({username, password, role: "USER"});
    }

    async onInitialize(): Promise<void> {
        await this.createTable();
        console.log(`AccountingServiceSQL: service is initialized`);
    }

    protected async _get(username: string): Promise<Account | undefined> {
        return this.db.select<Account>().from(accountTable).where({username}).first();
    }

    protected get db() {
        return this._db.dataBase;
    }
}