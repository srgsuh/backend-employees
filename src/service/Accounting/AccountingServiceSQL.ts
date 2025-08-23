import AccountingService from "./AccountingService.ts";
import LoginData from "../../model/LoginData.ts";
import LoginResponse from "../../model/LoginResponse.ts";
import {KnexDatabase} from "../KnexDatabase.ts";
import Account from "../../model/Account.ts";
import {AccountAlreadyExistsError, AuthenticationError} from "../../model/Errors.ts";
import {hash, compare} from "bcryptjs";
import JWTUtils from "../../security/JWTUtils.ts";
import {Initializable} from "../ServiceLifecycle.js";

const accountTable = "accounts";

export class AccountingServiceSQL implements AccountingService, Initializable {
    constructor(private readonly _db: KnexDatabase) {}

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
        console.log(`AccountingServiceSQL: login for ${JSON.stringify(loginData)}`);
        const account = await this._get(loginData.email);
        console.log(`AccountingServiceSQL: account ${JSON.stringify(account)}`);
        const compareOk = account && await compare(loginData.password, account.password);
        console.log(`AccountingServiceSQL: compare ${compareOk}`);
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
        const password = await hash(loginData.password, 10);
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