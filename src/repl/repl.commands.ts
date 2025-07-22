import { DeckAPI } from "../services/deck.services.js";
import { Config } from "../config/config.types.js";
import { texts } from "./repl.texts.js";
import type { CLICommand } from "./repl.types.js";



/* -------------------------------------------------------------------------- */
/*                                  COMMANDS                                  */
/* -------------------------------------------------------------------------- */
/** Exits process & logs a closing message - "exit" command related */
export const exit = () => {
    console.info(texts.promptClosing)
    process.exit(0)
}

/** Logs on exit - "help" command related */
export const help = () => {
  console.info('[ WIP: TO IMPLEMENT ]')
}

/** Displays 20 available maps - "map" command related */
export const locateMaps = async (deckAPI: DeckAPI) => {
  const results = await (await deckAPI.fetchLocations('next')).results;

  const names = results.map(x => x.name)
  return names
}

export const locateMapsBack = async (deckAPI: DeckAPI) => {
  const results = await (await deckAPI.fetchLocations('previous')).results;

  const names = results.map(x => x.name)
  return names
}

/* -------------------------------------------------------------------------- */
/*                                  REGISTRY                                  */
/* -------------------------------------------------------------------------- */

/** Commands Registry */
export const getCommands = (): Record<string, CLICommand> => {
  return {
    help: {
      name: "help",
      description: "Displays a help message",
      callback: help
    },
    exit: {
      name: "exit",
      description: `Exits the ${process.env.DECK_NAME}`,
      callback: exit,
    },
    map: {
      name: 'map',
      description: "Displays 20 available maps",
      callback: async(deckAPI: DeckAPI) => await locateMaps(deckAPI)
    },
    mapb: {
      name: 'mapb',
      description: "Displays 20 available maps",
      callback: async(deckAPI: DeckAPI) => await locateMapsBack(deckAPI)
    }
  };
}

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */
/** Sanitize input into array of words */
export const listInputCommands = (input:string): string[] => {
  const words = input
    .toLowerCase()
    .split(/\s/)
    .filter(Boolean)

  return words;
}


/* -------------------------------------------------------------------------- */
/*                                    USAGE                                   */
/* -------------------------------------------------------------------------- */

/** Displays commands usages  */
export const displayCommandUsages = (config: Config) => {
  const commands = config.commands
  let header = '';
  let content = '';

  const sectionMarker = "--------------------------------------------------------";
  header += `\t${sectionMarker}\n\t${sectionMarker}\n\n`
  header += `\t\t\t${texts.promptIntro}\n\n`

  for( let command in commands ){
    const commandDetailText = `\n\t\t- ${command}:\t ${commands[command].description}`
    content += commandDetailText;
  }

  const text = `${header}\n${content}\n`
  console.info(text)
};