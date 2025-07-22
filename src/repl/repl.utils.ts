import { texts } from "./repl.texts.js";
import type { CLICommands } from "./repl.types.js";
import { createInterface, type Interface } from "readline";

/** Logger  */
export const logPrompt = (input: string, hasEndingNewLine: boolean = true) => {
    const baseMessage = texts.promptValueHeader
    let message = `${baseMessage} ${input}`
    if( hasEndingNewLine ) message += '\n';
    console.info(message);
}


export interface ReplState extends Interface {
    commands: CLICommands
}


export const initReplState = (promptText: string) => {
     /** Repl interface  */
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: promptText
    });
    return rl
}