import { DeckAPI } from "../services/deck.api.js";
import { config } from "../config/config.index.js";
import { texts } from "./repl.texts.js";
import { loadOneBeing, loadMapNamesBack, loadMapNamesNext, loadPopulation, loadOneBeingDetails } from "../services/deck.api.controllers.js";
import { getSpaceSeparator } from "../utils/text.utils.js";

import type { CLICommand } from "./repl.types.js";
import type { Config } from "../config/config.types.js";




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


/* -------------------------------------------------------------------------- */
/*                                    USAGE                                   */
/* -------------------------------------------------------------------------- */

/** Displays commands usages  */
export const displayCommandUsages = (config: Config, isFirstDisplay: boolean = true) => {
  const commands = config.commands
  let header = '';
  let content = '';

  const space = '\u0020'
  const sectionMarker = "-----------------------------------------------------------";
  header += `\t${ sectionMarker }\n\t${sectionMarker}\n\n`
  header += `\t\t\t${texts.promptIntro}\n\n`
  header += `\t${ space }${ space }- ${sectionMarker.slice(0, Math.floor(sectionMarker.length / 1.2))} -\n`
  
  for( let command in commands ){
    const commandSpaceSeparator = getSpaceSeparator(command);
    const commandDetailText = `\n\t\t- ${ command }:${ commandSpaceSeparator }${ commands[ command ].description }`
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
      description: "Displays the next 20 location names",
      callback: async(deckAPI: DeckAPI) => await loadMapNamesNext(deckAPI),
      isDeckCommand: true
    },
    mapb: {
      name: 'mapb',
      description: "Displays the previous 20 location names",
      callback: async(deckAPI: DeckAPI) => await loadMapNamesBack(deckAPI),
      isDeckCommand: true
    },
    explore: {
      name: 'explore',
      description: "Gets the population for a given location",
      callback: async(deckAPI: DeckAPI, locationName: string) => await loadPopulation(deckAPI, locationName),
      isDeckCommand: true
    },
    catch: {
      name: 'catch',
      description: 'Attempt to catch a pokemon',
      callback: async(deckAPI: DeckAPI, name: string) => await loadOneBeing(deckAPI, name),
      isDeckCommand: true
    },
    inspect: {
      name: 'inspect',
      description: 'Gets details about a Pokemon in the Pokedex',
      callback: async(deckAPI: DeckAPI, name: string) => await loadOneBeingDetails(deckAPI, name),
      isDeckCommand: true
    },
    pokedex: {
      name: 'pokedex',
      description: 'Lists all Pokemons in the deck',
      callback: () => DeckAPI.collection,
      isDeckCommand: true
    }
  };
}