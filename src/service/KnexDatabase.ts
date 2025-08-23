import knex, {Knex} from "knex";
import {Closeable} from "./ServiceLifecycle.ts";

export class KnexDatabase implements Closeable {
    private readonly _dataBase: Knex;
    constructor(config: Knex.Config) {
        this._dataBase = knex(config);
    }

    get dataBase(): Knex {
        return this._dataBase;
    }

    async close(): Promise<void> {
        await this._dataBase.destroy();
    }
}