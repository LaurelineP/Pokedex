import { CLICommand } from "../../src/repl/repl.types.js"
import { CacheAPI } from "../state/config.cache.js";

export type Config = {
    /** Environments variable */
    env: {
        DECK_NAME: string;
        DECK_ICON: string;
        DECK_API: string;
        DECK_API_VERSION: string;
    },
    /** List of supported commands  */
    commands: Record<string, CLICommand>;

    /** API values */
    api: {
        baseURL: string
    }

    /** Cached Data from api */
    cachedData: CacheAPI<any>
}