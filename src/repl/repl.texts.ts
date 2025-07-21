export const texts = {
    prompt: `\n${process.env.DECK_ICON || '⟐' } ${process.env.DECK_NAME} > `,
    /** Return value from input */
    promptValueHeader: "|___",
    /** Log's header for a given command input */
    promptValueBodyCommand: "Your command was:",
    /** Log's introductive text for a given command input */
    promptIntro: 'Welcome to the Pokedex!',
    /** Log's message for closing action from CLI */
    promptClosing: 'Closing the Pokedex... Goodbye!'
}
