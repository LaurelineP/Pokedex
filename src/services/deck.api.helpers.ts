import { config } from "../config/config.index.js";
import { DeckAPI, MapLocation } from "./deck.api.js"


export const getAPILocationEndpoint = (deckAPI: DeckAPI, action: 'next' | 'previous') => {
    const lastURL = deckAPI.lastURL;
    const defaultURL = `${config.api.baseURL}/location-area`;
    const defaultOffset = 0;
    const defaultLimit = 20;
    
    let endpoint;
    
    /** Builds endpoint based on requested action */
    if( !lastURL ){
        endpoint = buildLocationEndpoint(defaultURL, defaultOffset, defaultLimit)
    } else {
        const previousEndpoint = new URL(lastURL);
        let previousOffset = Number(previousEndpoint.searchParams.get('offset'));
        
        if(previousOffset !== 0) {
            previousOffset = action === 'next' ? previousOffset + 20 : previousOffset - 20;
        }
        /* Minimal offset value.  */
        previousOffset = previousOffset < 0 ? defaultOffset : previousOffset;
        const minOffsetValue =  action === 'previous' && previousOffset ? previousOffset - 20 : 0;
        const offset = action === 'next' ? previousOffset + 20 : minOffsetValue;
        endpoint = buildLocationEndpoint( defaultURL, offset, defaultLimit);
    }
    return endpoint;
}

const buildLocationEndpoint = (baseURL: string, offset: string | number, limit: string | number ) => {
    return `${baseURL}?offset=${offset}&limit=${limit}`;
}


export const mapNames = (v: MapLocation ) => v.name;