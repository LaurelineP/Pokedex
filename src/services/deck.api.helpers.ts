import { config } from "../config/config.index.js";
import { DeckAPI, Location } from "./deck.api.js"


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
        const _url = new URL(lastURL);
        let paramsOffset = Number(_url.searchParams.get('offset'))
        /* Minimal offset value.  */
        paramsOffset = paramsOffset < 0 ? defaultOffset : paramsOffset
        const _offset = action === 'next' ? paramsOffset + 20 : paramsOffset - 20;
        endpoint = buildLocationEndpoint( defaultURL, _offset, defaultLimit);
    }
    return endpoint;
}

const buildLocationEndpoint = (baseURL: string, offset: string | number, limit: string | number ) => {
    return `${baseURL}?offset=${offset}&limit=${limit}`;
}


export const mapNames = (v: Location ) => v.name;