
process.loadEnvFile();

import { initReplState, logCommandOutput, logRootPrompt } from './repl.utils.js';
import { getTerminalInputs } from './repl.commands.js';
import { config } from '../config/config.index.js';
import { DeckAPI } from '../services/deck.api.js';

import { getEmote, texts } from './repl.texts.js'
import { capitalize } from '../utils/text.utils.js';

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
        switch (requestedCommand.name){
            case 'help':
            case 'exit':
                (requestedCommand.callback as RegularCallback)();
                break;
            case 'map':
            case 'mapb':
                 data = await (await requestedCommand.callback as APICallback)(deckAPI)
                 break;
            case 'catch':
                let tryCount = 0
                while(!data?.isCaught){
                    data = await (await requestedCommand.callback as APICallbackWithArg)(deckAPI, supportedArg);
                    logCommandOutput(requestedCommand, data, supportedArg, tryCount += 1 );
                    if(data.isCaught) break;
                }
                return;
            case 'explore':
            case 'inspect':
                data = await (await requestedCommand.callback as APICallbackWithArg)(deckAPI, supportedArg)
                if(!data){
                    throw 'Not Found'
                }
                break;
            case 'pokedex':
                data = DeckAPI.collection.map( datum => capitalize(datum.name) );
                break;
        }
       
        /* Logs output for a command */
        logCommandOutput(requestedCommand, data, supportedArg)
    } catch( error ){
        if( error === "Not Found"){
            const emote = getEmote('invalid')
            console.error(`\t|\n${texts.promptValueHeader} ❌${emote} Try with an existing pokemon...\n`)
        } else if( error instanceof TypeError){
            logRootPrompt('❌ Something went wrong.')
            console.error('error', error)
        }
        else {
            logRootPrompt('❌ Incorrect argument.')
        }
    } finally {
        rl.prompt();
    }
}