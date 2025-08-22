import knex, {Knex} from "knex";

export function createKnexDatabase(config: Knex.Config): Knex {
    return knex(config);
}