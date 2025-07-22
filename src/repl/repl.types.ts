import { DeckAPI } from "src/services/deck.services";

export type CLICommand = {
    name: string;
    description: string;
    callback: (deckState: DeckAPI) => any
}
export type CLICommands = Record<string, CLICommand>