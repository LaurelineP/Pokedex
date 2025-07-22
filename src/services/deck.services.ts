
import { config } from '../config/config.index.js'

export class DeckAPI {
    readonly #baseURL: string = config.api.baseURL;
    private static nextURL: null | string = null
    private static previousURL: null | string  = null


    constructor(){}

    #updatePaginations(response: ResponseLocation ){
        DeckAPI.nextURL     = response.next
        DeckAPI.previousURL = response.previous
    }

    /* Fetches locations per bunch of 20 - [ "map" "mabb" commands ]*/
    async fetchLocations(type: 'next' | 'previous'): Promise<ResponseLocation> {
        const endpointMapper = {
            next    : DeckAPI.nextURL,
            previous: DeckAPI.previousURL
        }
        /* Endpoint based on type or fallbacks to the original endpoint */
        const endpoint = endpointMapper[ type ] || `${this.#baseURL}/location-area`;
        try {
            const response = await (await fetch(endpoint)).json();
            this.#updatePaginations(response)
            return response;
        } catch( error ){
            throw error
        }
    }


    async fetchOneLocation(locationName: string){
        try {
            const response = await (await fetch(`${this.#baseURL}/${locationName}`)).json();
            return response
        } catch (error){
            throw error
        }
    }
}


export type ResponseLocation = {
  next: string; // URL for the next 20
  previous: string; // URL for the previous 20
  count: number; // total locations
  results: Location[] // 20 locations
};


export type Location = {
  name: string;
  url: string;
};
