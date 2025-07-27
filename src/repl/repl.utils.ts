import { capitalize, formatSpecToTexts } from "../utils/text.utils.js";
import { getEmote, messageTool, texts } from "./repl.texts.js";
import { createInterface, type Interface } from "readline";
import type { CLICommand, CLICommands } from "./repl.types.js";

/* -------------------------------------------------------------------------- */
/*                                   LOGGERS                                  */
/* -------------------------------------------------------------------------- */
/**
 * - Pretty: emphasizes a base CLI indentation
 * - root level: means starting from the CLI base indentation,
 *   this if a tree log made at the root level 
 * - log level: means starting from the CLI root level indentation,
 *   this if a nested tree log made from the root level 
 */
/** Pretty indented CLI log returned values
 * @example 
 * ```sh
 *      |___ Something is logged at root level # root level (e.g., CLI feedback message )
 *          |___ Something is logged # (e.g., CLI returned value message )
 * ```
 */
export const logPrompt = (input: string, hasEndingNewLine: boolean = true) => {
    const baseMessage = `\t${texts.promptValueHeader}`
    let message = `${baseMessage} ${input}`
    if( hasEndingNewLine ) message += '\n';
    console.info(message);
}

/** Pretty CLI log at root level
 * @example 
 * ```sh
 *      |___ Something is logged at root level # root level (e.g., CLI feedback message )
 *          |___ Something is logged # (e.g., CLI returned value message )
 * ```
 */
export const logRootPrompt = (input: string, hasEndingNewLine: boolean = true) => {
    let message = `${texts.promptValueHeader} ${input}`
    if( hasEndingNewLine ) message += '\n';
    console.info(message);
}

/** Log items in a list: either a flat list or nested list */
const logDataEntry = (data: any[], isNested: boolean = false) => {
    console.info(messageTool.content + messageTool.start.line)
    if(isNested){
        logNestedDataEntry(data)
    } else {
        data.forEach(( datum: string ) => logPrompt( datum, false ))
    }
}

/** Log nested data entry */
const logNestedDataEntry = (data: any[]) => {
    data.forEach(( datum: string ) => {
        const isDatumArray = Array.isArray(datum);
        const hasDatumNestedArray = Array.isArray(datum[0])
        if(isDatumArray && hasDatumNestedArray){
            datum.forEach( datumItem => {                        
                logPrompt( `\t• ${datumItem.join(`: `)}`, false )
            })
        } else if( isDatumArray && !hasDatumNestedArray){
            logPrompt(`\t• ${datum}`, false )
        } else {
            logPrompt(datum, false )
        }
    })
}


/**
 * Logs output for the different context
 * @param requestedCommand - commands details
 * @param data - data from the executed command to log
 * @param supportedArg - second word from command line
 * @param count - iteration count
 */
export const logCommandOutput = (requestedCommand: CLICommand, data: any, supportedArg: string, count: number = 0) => {
    messageTool.content = `${messageTool.headerBase} ${texts.promptValueHeader} `;
    switch(requestedCommand.name){
        case 'map':
        case 'mapb':
            const mapContext = requestedCommand.name === 'map' ? 'next' : 'previous' 
            messageTool.content += `🌏 Mapping ${ mapContext } locations...`
            logDataEntry(data);
            break;

        case 'explore':
            messageTool.content += `📍 Population found for "${supportedArg.replaceAll('-', ' ')}":`
            logDataEntry(data);
            break; 
 
        case 'catch':
            const name = capitalize(supportedArg);
            if( count === 1){
                messageTool.content += `🪤  Throwing a Pokeball at ${name}...`;
                console.info(messageTool.content + '\n\t\t|')
            } else {
                messageTool.content = `\t\t|\n\t\t|\n\t\t| 🪤  Trying again...`;
                console.info(messageTool.content)

            }
            const messageIcon = data.isCaught ? '✨' : getEmote('fail')
            const messageVariant = data.isCaught ? 'caught' : 'escaped'
            let extraMessage = `${ messageIcon } ${ name } ${messageVariant}!`
            if( data.isCaught ){
                const extraMessageIndents = `${messageTool.start.line}${messageTool.start.line}${messageTool.start.line}  `
                const extraMessageStart = count > 10 ? 'Gosh, after' : count > 5 ? 'Finally, after' : 'Yay, after'
                const extraMessageEnd = (count > 5 ? '. . .' : count > 5 ? '...' : '!' ) + messageTool.start.line
                extraMessage += extraMessageIndents
                extraMessage += `${extraMessageStart} ${count} attempt(s)${extraMessageEnd}`
                extraMessage += `  You may now inspect it with the "inspect ${name.toLowerCase()}" command.`
                extraMessage += messageTool.start.line
            }
            logPrompt(extraMessage, false)
            break;
        case 'inspect':
            messageTool.content += `ℹ️  Info about ${supportedArg}:`;
            const { baseExperience, isCaught, ...toProcess } = data;
            const dataTexts = formatSpecToTexts(toProcess)
            logDataEntry(dataTexts, true)
            break;
        case 'pokedex':
            messageTool.content += `📖 Pokedex list:`;
            logDataEntry(data, true)
            break;
    }
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