
process.loadEnvFile();
import { initReplState, logPrompt } from './repl.utils.js';
import { texts } from './repl.texts.js'
import { listInputCommands } from './repl.commands.js';
import { config } from '../config/config.index.js';




/** Executes Deck REPL */
export const startREPL = (deckName: string = 'Deck') => {

    const commands = config.commands
    const rl = initReplState(texts.prompt);

    /* Event callback configuration */
    const callback = (valueFromStream: string) => {
        const inputWords = listInputCommands(valueFromStream);
        

        if(!inputWords.length){
            logPrompt("nothing indeedx")

            rl.prompt();
        } else {
            /* Dynamic gets command if available or error */
            const command = inputWords[0];
            try {
                commands[ command ]?.callback();
            } catch( error ){
                console.error('Unknown command.')
            }
            rl.prompt();
        }
    }
   
    rl.prompt();


    /* Handles line event */
    rl
        .on('line', callback)
        .on('close', commands.exit.callback)
}


