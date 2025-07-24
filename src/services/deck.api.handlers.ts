
/* -------------------------------------------------------------------------- */
/*                                  I/O APIs                                  */
/* -------------------------------------------------------------------------- */

import { config } from "../config/config.index.js";
import { updateCache } from "../repl/repl.commands.js";
import { getAPILocationEndpoint, mapNames } from "./deck.api.helpers.js";
import { DeckAPI } from "./deck.api.js";


/** Displays 20 initial or next map location names - "map" command related */
export const loadMapNamesNext = async (deckAPI: DeckAPI) => {
  const endpoint = getAPILocationEndpoint(deckAPI, 'next' );
  const names =  await loadMapNamesData(deckAPI, endpoint)
  updateCache(names, endpoint);
  return names;
}

/** Displays 20 previous map locations names - "map" command related */
export const loadMapNamesBack = async (deckAPI: DeckAPI) => {
  const endpoint = getAPILocationEndpoint(deckAPI, 'previous' );

  const names = await loadMapNamesData(deckAPI, endpoint)
  updateCache(names, endpoint);
  return names;
}

/** Load map names data for next or previous actions */
const loadMapNamesData = async (deckAPI: DeckAPI, endpoint: string)=> {
  const cachedData = config.cachedData.get(endpoint);

  const names =  cachedData?.value
    || await ( await deckAPI
      .fetchLocations(endpoint) )
      .results.map(mapNames);
  deckAPI.lastURL = endpoint
  return names
}