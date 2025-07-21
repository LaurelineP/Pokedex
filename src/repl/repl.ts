
import { createInterface }  from 'node:readline';
import { listInputCommands, logPrompt } from './repl.helpers.js';
import { messages } from './repl.messages.js'
import { getCommands } from './repl.commands.js';

export const startREPL = () => {
    /** Repl interface  */
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: messages.prompt
    });

    /* Event callback configuration */
    const callback = (valueFromStream: string) => {
        const inputWords = listInputCommands(valueFromStream);

        if(!inputWords.length){
            logPrompt("nothing indeedx")

            rl.prompt();
        } else {
            // logPrompt(`${messages.promptValueBodyCommand} ${inputWords[0]}`)
            const command = inputWords[0];
            try {
                getCommands()?.[ command ]?.callback();
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
        .on('close', getCommands().exit.callback)
}

export {}
