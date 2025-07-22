
process.loadEnvFile();
import { initReplState, logPrompt } from './repl.utils.js';
import { texts } from './repl.texts.js'
import { listInputCommands } from './repl.commands.js';
import { config } from '../config/config.index.js';
import { DeckAPI } from '../services/deck.services.js';




/** Executes Deck REPL */
export const startREPL = (deckName: string = 'Deck') => {

    const commands = config.commands;
    const rl = initReplState(texts.prompt);

    /* Event callback configuration */
    const callback = async (valueFromStream: string) => {
        const inputWords = listInputCommands(valueFromStream);
        

        if(!inputWords.length){
            logPrompt(texts.promptValueBodyCommandRetry)

            rl.prompt();
        } else {
            /* Dynamically gets command if available or error */
            const command = inputWords[0];
            try {
                const deckAPI = new DeckAPI();
                /* Executes the command callbacks */
                const data: string[] = await commands[ command ]?.callback(deckAPI);
                for(let datum of data){
                    logPrompt(datum, false)
                }
            } catch( error ){
                console.error('Unknown command.')
            }
            rl.prompt();
        }
    }
   
    rl.prompt();


    /* Handles line event */
    rl
        .on('line', async (val: string) => { await callback(val)})
        .on('close', commands.exit.callback)
}


