
/* -------------------------------------------------------------------------- */
/*                                  I/O APIs                                  */
/* -------------------------------------------------------------------------- */
import { config } from "../config/config.index.js";
import { updateCache } from "../state/state.cache.js";

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

/** Loads population for a given location */
export const loadPopulation = async (deckAPI: DeckAPI, locationName: string) => {
  const endpoint = `${config.api.baseURL}/location-area/${locationName}`
  const cachedData = config.cachedData.get(endpoint);

  const population = cachedData?.value 
    || await( await deckAPI
      .fetchPopulation(endpoint))
      .pokemon_encounters
      .map( datum => datum.pokemon)
      .map( mapNames )
      
  updateCache(population, endpoint);
  return population
}


/** Load the attempted caught being */
export const loadOneBeing = async (deckAPI: DeckAPI, name: string) => {
   const endpoint = `${config.api.baseURL}/pokemon/${name}`

   const cachedData = config.cachedData.get(endpoint);
   
   const dataInfo = cachedData?.value 
   || await deckAPI
    .fetchLivingEntity(endpoint);


    /** Catchability */
    const baseExperience = dataInfo.baseExperience || dataInfo.base_experience;
    const randomizedNumber = Math.floor( Math.random() * (baseExperience * 1.2));

    /* Caught statuses
    * - caught in deck: already in the collection - no need to add to the collection
    * - just caught: already in the collection - needs to add into the collection
    * */
    const _isCaughtInDeck = !!DeckAPI.collection.find(x => x?.name === name )
    const _isJustCaught =  randomizedNumber > baseExperience;
    const isCaught = _isCaughtInDeck || _isJustCaught;
    
    /** Loaded data formatted */
    const data: {name: string, baseExperience: number} = {
      name: dataInfo.name,
      baseExperience,
    }

    /** Collect to the deck if  */
    if(_isJustCaught){
      DeckAPI.collection.push({...data, isCaught})
    }
    
    updateCache(data, endpoint);

  return {...data, isCaught }
}

// TODO: all above in try catch 