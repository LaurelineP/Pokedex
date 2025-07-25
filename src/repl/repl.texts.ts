export const texts = {
    prompt: `\n\t${process.env.DECK_ICON || '⟐' } ${process.env.DECK_NAME} > `,
    /** Return value from input */
    promptValueHeader: "\t|___",
    /** Log's header for a given command input */
    promptValueBodyCommand: "Your command was:",
    /** Log's introductive text for a given command input */
    promptIntro: '🙌 Welcome to the Pokedex!',
    /** Log's message for closing action from CLI */
    promptClosing: '👋 Closing the Pokedex... Goodbye!',
    /** Asks to retry providing an input */
    promptValueBodyCommandRetry: '❌ Please provide a valid command',
    /** Unsupported command message */
    promptValueBodyCommandUnssuported: '❌ Unssupported commands'
}
