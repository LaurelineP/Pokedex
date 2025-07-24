import { DeckAPI } from "../services/deck.api.js";
import { texts } from "./repl.texts.js";
import type { CLICommand } from "./repl.types.js";
import { loadMapNamesBack, loadMapNamesNext } from "../services/deck.api.handlers.js";
import { config } from "../config/config.index.js";
import { Config } from "../config/config.types.js";



/* -------------------------------------------------------------------------- */
/*                                  COMMANDS                                  */
/* -------------------------------------------------------------------------- */

/** Exits process & logs a closing message - "exit" command related */
export function exit () {
    console.info(texts.promptClosing)
    process.exit(0)
}

/** Logs on exit - "help" command related */
export function help () {
  displayCommandUsages(config, false);
}



/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */
/** Sanitize input into array of words */
export const getTerminalInputs = (input:string): string[] => {
  const words = input
    .toLowerCase()
    .split(/\s/)
    .filter(Boolean)

  return words;
}

export const updateCache = (data: any, url: string) => {
  
    config.cachedData.add(url, data);
  
}


/* -------------------------------------------------------------------------- */
/*                                    USAGE                                   */
/* -------------------------------------------------------------------------- */

/** Displays commands usages  */
export const displayCommandUsages = (config: Config, isFirstDisplay: boolean = true) => {
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

  const text = isFirstDisplay ? `${header}\n${content}\n` : `\n${content}\n`
  console.info(text)
};


/* -------------------------------------------------------------------------- */
/*                                  REGISTRY                                  */
/* -------------------------------------------------------------------------- */

/** Commands Registry */
export function getCommands(): Record<string, CLICommand> {
  return {
    help: {
      name: "help",
      description: "Displays a help message",
      callback: help,
      isDeckCommand: false
    },
    exit: {
      name: "exit",
      description: `Exits the ${process.env.DECK_NAME}`,
      callback: exit,
      isDeckCommand: false
    },
    /* -------------------------------------------------------------------------- */
    /*                  DECK COMMANDS - Requiring external fetchs                 */
    /* -------------------------------------------------------------------------- */
    map: {
      name: 'map',
      description: "Displays the next 20 available map location names",
      callback: async(deckAPI: DeckAPI) => await loadMapNamesNext(deckAPI),
      isDeckCommand: true
    },
    mapb: {
      name: 'mapb',
      description: "Displays the previous 20 available location names",
      callback: async(deckAPI: DeckAPI) => await loadMapNamesBack(deckAPI),
      isDeckCommand: true
    }
  };
}