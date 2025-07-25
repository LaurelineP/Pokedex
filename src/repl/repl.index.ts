
process.loadEnvFile();

import { initReplState, logPrompt, logRootPrompt } from './repl.utils.js';
import { getTerminalInputs } from './repl.commands.js';
import { config } from '../config/config.index.js';
import { DeckAPI } from '../services/deck.api.js';

import { getEmote, messageTool, texts } from './repl.texts.js'

import type { Interface } from 'readline';
import type { APICallback, APICallbackWithArg, CLICommand, RegularCallback } from './repl.types.js';



const deckAPI = new DeckAPI();

/** Execute Deck REPL */
export const startDeckREPL = (deckName: string = 'Deck') => {

    const commands = config.commands;
    const rl = initReplState(texts.prompt);

    /* Event callback configuration */
    const callbackReplLine = async (terminalInputLine: string) => {
        return handleTerminalInputs(terminalInputLine, rl)
    }
    
    rl.prompt();
    /* Handles line event */
    rl
        .on('line', callbackReplLine)
        .on('close', commands.exit.callback)
}



/** Centralizes & Validates the terminal prompt input line commands */
const handleTerminalInputs = async (terminalInputLine: string, rl: Interface) => {
    const inputWords = getTerminalInputs(terminalInputLine);

    const inputLength = inputWords.length;
    const hasNoCommands = inputLength === 0;
    const isSupportedCommands = inputLength <= 2 && inputWords?.[0] in config.commands;
    const isErroring = hasNoCommands || !isSupportedCommands;
    if(isErroring){
        /* Asks to retry submitting a command */
        if(hasNoCommands){
            logRootPrompt(texts.promptValueBodyCommandRetry)
        } else if ( !isSupportedCommands ){
            logRootPrompt(texts.promptValueBodyCommandUnsuported)
        }
        rl.prompt();
    } else {
        await handleCommand( inputWords, rl )
    }
    
}

/** Handles the command requested */
const handleCommand = async (commandInputs: string[], rl: Interface) => {
    const supportedCommand = commandInputs[0];
    const supportedArg = commandInputs?.[1];
    const commandMapper = config.commands;
    try {
        let data;
        const requestedCommand = commandMapper[ supportedCommand ];

        /* Execute the command handler based on isDeckCommand which conditions the argument */
        if(!requestedCommand.isDeckCommand){
            (requestedCommand.callback as RegularCallback)()
        } else if(!supportedArg) {
            data = await (await requestedCommand.callback as APICallback)(deckAPI)
        } else if(supportedArg){
            data = await (await requestedCommand.callback as APICallbackWithArg)(deckAPI, supportedArg)
        }
       
        /* Logs output for a command */
        logCommandOutput(requestedCommand, data, supportedArg)
    } catch( error ){
        if( error === "Not Found"){
            const emote = getEmote('invalid')
            console.error(`\t|\n${texts.promptValueHeader} ❌${emote} Try with an existing pokemon...\n`)
        } else {
            logRootPrompt('❌ Incorrect argument.')
        }
    } finally {
        rl.prompt();
    }
}

/**
 * Logs output for the different context
 * @param requestedCommand 
 * @param data 
 * @param supportedArg 
 */
const logCommandOutput = (requestedCommand: CLICommand, data: any, supportedArg: string) => {
    const logDataEntry = () => {
        console.info(messageTool.content + '\n\t\t|')
        data.forEach(( datum: string ) => logPrompt( datum, false ))
    }

    messageTool.content = `${messageTool.headerBase} ${texts.promptValueHeader} `;
    switch(requestedCommand.name){
        case 'map':
        case 'mapb':
            const mapContext = requestedCommand.name === 'map' ? 'next' : 'previous' 
            messageTool.content += `🌏 Mapping ${ mapContext } locations...`
            logDataEntry();
            break;

        case 'explore':
            messageTool.content += `📍 Population found for "${supportedArg.replaceAll('-', ' ')}":`
            logDataEntry();
            break; 
 
        case 'catch':
            messageTool.content += `🪤  Throwing a Pokeball at ${supportedArg}...`;
            console.info(messageTool.content + '\n\t\t|')
            
            const messageIcon = data.isCaught ? '✨' : getEmote('fail')
            const messageVariant = data.isCaught ? 'caught' : 'escaped'
            const extraMessage = `${ messageIcon } ${ supportedArg } ${messageVariant}!`
            logPrompt(extraMessage)
            break;
    }
}