
import { messages } from "./repl.messages.js";
import { CLICommand } from "./repl.types.js";

/* -------------------------------------------------------------------------- */
/*                                  COMMANDS                                  */
/* -------------------------------------------------------------------------- */
/** Exits process & logs a closing message */
export const exit = () => {
    console.info(messages.promptClosing)
    process.exit(0)
}

/** Logs on exit */
export const help = () => {}


/* -------------------------------------------------------------------------- */
/*                                  REGISTRY                                  */
/* -------------------------------------------------------------------------- */

/** Commands Registry */
export function getCommands(): Record<string, CLICommand> {
  return {
    help: {
      name: "help",
      description: "Displays a help message",
      callback: help
    },
    exit: {
      name: "exit",
      description: "Exits the pokedex",
      callback: exit,
    },
  };
}


/* -------------------------------------------------------------------------- */
/*                                    USAGE                                   */
/* -------------------------------------------------------------------------- */
/** Displays commands usages  */
export const displayCommandUsages = (() => {
  const commands = getCommands();
  let header = '';
  let content = '';

  const sectionMarker = "--------------------------------------------------------";
  header += `\t${sectionMarker}\n\t${sectionMarker}\n\n`
  header += `\t\t\t${messages.promptIntro}\n\n`

  for( let command in commands ){
    const commandDetailText = `\n\t\t- ${command}:\t ${commands[command].description}`
    content += commandDetailText;
  }

  const text = `${header}\n${content}\n`
  console.info(text)
})();
