
import { getOrThrowEnvVariable } from "./config.helpers.js";
import { getCommands } from "../repl/repl.commands.js";
import { CacheAPI } from "../state/config.cache.js";
import type { Config } from "./config.types.js";

/** Loads environment file to generate a config */
const loadConfig = () => {
    const DECK_API = getOrThrowEnvVariable('DECK_API')
    const DECK_API_VERSION = getOrThrowEnvVariable('DECK_API_VERSION')
    const config: Config = {
        env: {
            DECK_NAME: getOrThrowEnvVariable('DECK_NAME'),
            DECK_ICON: getOrThrowEnvVariable('DECK_ICON'),
            DECK_API,
            DECK_API_VERSION
        },
        commands: getCommands(),
        api: {
            baseURL: `${DECK_API}/${DECK_API_VERSION}`
        },
        cachedData: new CacheAPI(3600000)

    }
    
    return config
}

/** Project config */
export const config = loadConfig();
