import { messages } from "./repl.messages.js";

export const logPrompt = (input: string) => {
    const baseMessage = messages.promptValueHeader
    const message = `${baseMessage} ${input}\n`
    console.info(message);
}

/** Sanitize input into array of words */
export const listInputCommands = (input:string): string[] => {
    const words = input
        .toLowerCase()
        .split(/\s/)
        .filter(Boolean)

    return words;
}

