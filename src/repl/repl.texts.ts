export const texts = {
    prompt: `\n\t${process.env.DECK_ICON || '⟐' } ${process.env.DECK_NAME} > `,
    /** Return value from input */
    promptValueHeader: "\t|___",
    /** Log's header for a given command input */
    promptValueBodyCommand: "Your command was:",
    /** Log's introductive text for a given command input */
    /** Log's message for closing action from CLI */
    promptIntro: '🙌 Welcome to the Pokedex CLI!\n\n\t\tInterract with the CLI to gets various\n\t\tlocations, catch pokemons and get their infos.',
    promptClosing: '👋 Closing the Pokedex... Goodbye!',
    /** Asks to retry providing an input */
    promptValueBodyCommandRetry: '❌ Please provide a valid command',
    /** Unsupported command message */
    promptValueBodyCommandUnsuported: '❌ Unssupported commands'
}


export const messageTool = {
    headerBase: `\t|\n `,
    start: { line: '\n\t\t|', lineWithMessage: '\n\t\t', },
    content: ''
}


const emotes = {
    fail: ['🫣 ', '😣'],
    invalid: ['🥱', '😑', '😤', '😡'],
}

export const getEmote = (kind: 'fail'| 'invalid') => {
    let emote = ''
    if(kind in emotes){
        const emoticons = emotes[ kind ];
        const randomIndex = Math.round(Math.random() * (emoticons.length - 1))
        emote =  emoticons[ randomIndex ]
    }
    return emote;
}