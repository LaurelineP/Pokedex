
import { getOrThrowEnvVariable } from "./config.helpers.js";
import { getCommands } from "../repl/repl.commands.js";
import { Config } from "./config.types.js";

/** Loads environment file to generate a config */
const loadConfig = () => {
    const config: Config = {
        env: {
            DECK_NAME: getOrThrowEnvVariable('DECK_NAME'),
            DECK_ICON: getOrThrowEnvVariable('DECK_ICON')
        },
        commands: getCommands()
    }
    return config
}

/** Project config */
export const config = loadConfig();
