
process.loadEnvFile();

import { initReplState, logPrompt } from './repl.utils.js';
import { texts } from './repl.texts.js'
import { getTerminalInputs } from './repl.commands.js';
import { config } from '../config/config.index.js';
import { DeckAPI } from '../services/deck.api.js';
import { Interface } from 'readline';
import { APICallback, RegularCallback } from './repl.types.js';



const deckAPI = new DeckAPI();

/** Executes Deck REPL */
export const startDeckREPL = (deckName: string = 'Deck') => {

    const commands = config.commands;
    const rl = initReplState(texts.prompt);

    /* Event callback configuration */
    const callbackReplLine = async (terminalInputLine: string) => {
        handleTerminalInputs(terminalInputLine, rl)
    }
   
    rl.prompt();


    /* Handles line event */
    rl
        .on('line', callbackReplLine)
        .on('close', commands.exit.callback)
}



/** Centralizes & Validates the terminal prompt input line */
const handleTerminalInputs = (terminalInputLine: string, rl: Interface) => {
    const inputWords = getTerminalInputs(terminalInputLine);

    const inputLength = inputWords.length;
    const hasNoCommands = inputLength === 0;
    const isSupportedCommands = inputLength === 1 && inputWords?.[0] in config.commands;
    
    /* Asks to retry submitting a command */
    if(hasNoCommands){
        logPrompt(texts.promptValueBodyCommandRetry)
    } else if (!isSupportedCommands){
        logPrompt(texts.promptValueBodyCommandUnssuported)
    } else {
        handleCommand( inputWords, rl )
    }
    rl.prompt();
}

/** Handles the command requested */
const handleCommand = async (commandInputs: string[], rl: Interface) => {
    const supportedCommand = commandInputs[0];
    const commandMapper = config.commands;
    let data;
    try {
        const requestedCommand = commandMapper[ supportedCommand ];
        let data;

        // Execute the command handler based on isDeckCommand which condition the argument
        if(!requestedCommand.isDeckCommand){
            (requestedCommand.callback as RegularCallback)()
        } else {
            data = await (await requestedCommand.callback as APICallback)(deckAPI)
        }
       
        /* Lists requested locations names */
        if( requestedCommand.name === 'map' || requestedCommand.name === 'mapb'){
            data.forEach(( datum: string ) => logPrompt(datum, false))
        }

        /* Returns prompt */
        rl.prompt();

    } catch( error ){
        console.error('Unknown command.')
        console.error(error)
    }
}