
/* -------------------------------------------------------------------------- */
/*                                  I/O APIs                                  */
/* -------------------------------------------------------------------------- */
import { config } from "../config/config.index.js";
import { updateCache } from "../state/state.cache.js";

import { getAPILocationEndpoint, mapNames } from "./deck.api.helpers.js";
import { DeckAPI, EndpointCatch, EndpointCatchDTO, EndpointExplore, EndpointMap } from "./deck.api.js";


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

   let data;
   /* Data from already requested and saved data */
   if( cachedData ){
     data             = cachedData.value;
    }
    /* Newly requested data */
    else {
      const response  = await deckAPI.fetchEndpoint<EndpointCatch>(endpoint)
      data            = getOneBeingSpecsToDTO(response)
    }
    
   /* -------------------------- CATCHABILITY & STATUS ------------------------- */
   /** Catchability indice, should be higher to `catchabilityNumber` */
    const baseExperience = data.baseExperience;
    const catchabilityNumber = Math.floor( Math.random() * (baseExperience * 1.2));

    /* Caught statuses
    * - caught in deck: already in the collection - no need to add to the collection
    * - just caught: already in the collection - needs to add into the collection
    * */
    const isCaughtInDeck = DeckAPI.collection.some(x => x?.name === name )
    const isCatchSuccessful =  catchabilityNumber > baseExperience;

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


export const loadOneBeingDetails = ( deckAPI: DeckAPI, name: string) => {
  const deckCollection  = DeckAPI.collection;
  const compare = (stored: {name: string}) => stored.name.toLocaleLowerCase() === name.toLocaleLowerCase();
  const found = deckCollection.find(compare);

  if( found ){
    const parsed = getParsedBeing( found )
    return parsed;
  }
}
export const getOneBeingSpecsToDTO = (being: EndpointCatch): EndpointCatchDTO => {
  const { base_experience, stats, types, height, weight, name } = being;
  return {
    name,
    height,
    weight,
    baseExperience: base_experience,
    types: types.map(({ type }) => ({
      type: { name: type.name }
    })),
    stats: stats.map(({ base_stat, stat }) => ({
      baseStat: base_stat,
      stat
    })),
  }
}


export const getParsedBeing = ( being: EndpointCatchDTO & { isCaught: boolean }) => {
  return {
    ...being,
    stats: being.stats.map(_stat => {
      return {
        [ _stat.stat.name ]: _stat.baseStat
      }
    }),
    types: being.types.map(typeItem => typeItem.type.name )
  }
}