import { DeckAPI } from "../services/deck.api";


export type DeckCallbackLocationNames = string[]

export type APICallback = (deskAPI: DeckAPI) => (Promise<any> | any);
export type APICallbackWithArg = (deskAPI: DeckAPI, arg: string) => (Promise<any> | any);
export type RegularCallback = () => void;
export type DeckCommandCallback = RegularCallback | APICallback
export interface CLICommand {
    name: string;
    description: string;
    callback: RegularCallback | APICallback | APICallbackWithArg;
    isDeckCommand: boolean
}
export type CLICommands = Record<string, CLICommand>