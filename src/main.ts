import "./config/config.env.js";

import { config } from "./config/config.index.js";
import { displayCommandUsages } from "./repl/repl.commands.js";
import { startDeckREPL } from "./repl/repl.index.js";

function main() {
  displayCommandUsages(config);
  startDeckREPL(config.env.DECK_NAME);
}

main();