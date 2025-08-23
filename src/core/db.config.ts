import {Knex} from "knex";

export const configBetterSQLite3: Knex.Config = {
    client: "better-sqlite3",
    connection: {
        filename: process.env.SQLITE_FILE_NAME || "./db.sqlite"
    },
    useNullAsDefault: true,
}

export const configSQLite3: Knex.Config = {
    client: "sqlite3",
    connection: {
        filename: process.env.SQLITE_FILE_NAME || "./db.sqlite"
    },
};