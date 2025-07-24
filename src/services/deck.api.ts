import { config } from '../config/config.index.js';

export class DeckAPI {
    readonly #baseURL: string = config.api.baseURL;
    #lastURL: string | null = null;
    private static nextURL: null | string = null;
    private static previousURL: null | string  = null;

    constructor(){}

    #updateLastURL(endpoint: string){
        this.#lastURL = endpoint
    }

    #updatePaginations( response: ResponseLocation){
        DeckAPI.nextURL     = response.next
        DeckAPI.previousURL = response.previous
    }

    /* Fetches locations per bunch of 20 - [ "map" "mapb" commands ]*/
       async fetchLocations(endpointPaginated: string): Promise<ResponseLocation> {
        try {
            const response = await (await fetch(endpointPaginated)).json();
            this.#updatePaginations(response)
            this.#updateLastURL(endpointPaginated)
            return response;
        } catch( error ){
            throw error
        }
    }


    async fetchOneLocation(endpointPaginated: string){
        try {
            const response = await (await fetch(endpointPaginated)).json();
            return response
        } catch (error){
            throw error
        }
    }

    get lastURL(){
        return this.#lastURL
    }

    set lastURL( endpoint: string | null){
        this.#lastURL = endpoint
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

