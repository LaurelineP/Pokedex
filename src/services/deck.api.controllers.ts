
/* -------------------------------------------------------------------------- */
/*                                  I/O APIs                                  */
/* -------------------------------------------------------------------------- */
import { config } from "../config/config.index.js";
import { updateCache } from "../state/state.cache.js";

import { getAPILocationEndpoint, mapNames } from "./deck.api.helpers.js";
import { DeckAPI, EndpointCatch, EndpointExplore, EndpointMap } from "./deck.api.js";


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
  try {
    const cachedData = config.cachedData.get(endpoint);
  
    const names =  cachedData?.value
      || await ( await deckAPI
        .fetchEndpoint<EndpointMap>(endpoint) )
        .results.map(mapNames);
    deckAPI.lastURL = endpoint
    return names
  } catch ( error ){
    if( error instanceof Error ){
      throw ( error.message )
    }
  }
}

/** Loads population for a given location */
export const loadPopulation = async (deckAPI: DeckAPI, locationName: string) => {
  const endpoint = `${config.api.baseURL}/location-area/${locationName}`
  const cachedData = config.cachedData.get(endpoint);

  const population = cachedData?.value 
    || await( await deckAPI
      .fetchEndpoint<EndpointExplore>(endpoint))
      .pokemon_encounters
      .map( datum => datum.pokemon)
      .map( mapNames )
      
  updateCache(population, endpoint);
  return population
}

/** Load the attempted caught being 
 * - gets from cache
 * - or request data, update cache and deck collection
*/
export const loadOneBeing = async (deckAPI: DeckAPI, name: string) => {
  try {
    const endpoint = `${config.api.baseURL}/pokemon/${name}`;
   const cachedData = config.cachedData.get(endpoint);
   

   /* ---------------------------------- DATA ---------------------------------- */

   let dataInfo, baseExperience: number;
   /* Data from already requested and saved data */
   if( cachedData ){
     dataInfo        = cachedData.value;
     baseExperience  = dataInfo.baseExperience;
    }
    /* Newly requested data */
    else {
      dataInfo        = await deckAPI.fetchEndpoint<EndpointCatch>(endpoint)
      baseExperience  = dataInfo.base_experience;
   }

   /* -------------------------- CATCHABILITY & STATUS ------------------------- */

    /** Catchability indice, should be higher to `catchabilityNumber` */
    const catchabilityNumber = Math.floor( Math.random() * (baseExperience * 1.2));

    /* Caught statuses
    * - caught in deck: already in the collection - no need to add to the collection
    * - just caught: already in the collection - needs to add into the collection
    * */
    const isCaughtInDeck = DeckAPI.collection.some(x => x?.name === name )
    const isCatchSuccessful =  catchabilityNumber > baseExperience;
    
    /** Loaded data formatted */
    const data: {name: string, baseExperience: number} = {
      name: dataInfo.name,
      baseExperience,
    }

    /* ----------------------------- DECK COLLECTION ---------------------------- */
  
    /** Collect to the deck if  */
    const isCaught =  isCaughtInDeck || isCatchSuccessful;
    if(isCatchSuccessful) DeckAPI.collection.push({ ...data, isCaught })

    
    updateCache(data, endpoint);

  return {...data, isCaught }

  } catch( error ){
    if( error instanceof Error ){
      throw ( error.message )
    }
  }
   
}