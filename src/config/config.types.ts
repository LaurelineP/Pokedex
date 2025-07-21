import { CLICommand } from "../../src/repl/repl.types.js"

export type Config = {
    env: {
        DECK_NAME: string;
        DECK_ICON: string;
    },
    commands: Record<string, CLICommand>;
}