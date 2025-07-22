import { CLICommand } from "../../src/repl/repl.types.js"

export type Config = {
    env: {
        DECK_NAME: string;
        DECK_ICON: string;
        DECK_API: string;
        DECK_API_VERSION: string;
    },
    commands: Record<string, CLICommand>;
    api: {
        baseURL: string
    }
}