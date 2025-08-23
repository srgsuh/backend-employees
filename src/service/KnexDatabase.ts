import knex, {Knex} from "knex";
import {Closable} from "./ServiceLifecycle.ts";

export class KnexDatabase implements Closable {
    private readonly _dataBase: Knex;
    constructor(config: Knex.Config) {
        this._dataBase = knex(config);
    }

    get dataBase(): Knex {
        return this._dataBase;
    }

    async onClose(): Promise<void> {
        await this._dataBase.destroy();
        console.log("KnexDatabase: Database connection closed");
    }
}