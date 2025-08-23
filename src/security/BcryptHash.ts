import HashProvider from "./HashProvider.ts";
import {getEnvIntVariable} from "../utils/env-utils.ts";
import {compare, hash} from "bcryptjs";

const DEFAULT_SALT_ROUNDS = 10;
const saltRounds = getEnvIntVariable("HASH_SALT_ROUNDS", DEFAULT_SALT_ROUNDS);

export class BcryptHash implements HashProvider
{
    async compare (payload: string, hashed: string): Promise<boolean> {
        return compare(payload, hashed);
    }

    async hash(payload: string): Promise<string> {
        return hash(payload, saltRounds);
    }
}