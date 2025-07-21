import { Config } from "../config/config.types.js";
import { texts } from "./repl.texts.js";
import type { CLICommand } from "./repl.types.js";



/* -------------------------------------------------------------------------- */
/*                                  COMMANDS                                  */
/* -------------------------------------------------------------------------- */
/** Exits process & logs a closing message */
export const exit = () => {
    console.info(texts.promptClosing)
    process.exit(0)
}

/** Logs on exit */
export const help = () => {
  console.info('[ WIP: TO IMPLEMENT ]')
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