import { config } from '../config/config.index.js';

export class DeckAPI {
    readonly #baseURL: string = config.api.baseURL;
    #lastURL: string | null = null;
    private static nextURL: null | string = null;
    private static previousURL: null | string  = null;
    static collection: Array<{ isCaught: boolean, name: string, baseExperience: number }> = []

    constructor(){}

    #updateLastURL(endpoint: string){
        this.#lastURL = endpoint
    }

    #updatePaginations( response: ResponseShallow<EndpointMap>){
        DeckAPI.nextURL     = response.next
        DeckAPI.previousURL = response.previous
    }

      get lastURL(){
        return this.#lastURL
    }

    set lastURL( endpoint: string | null){
        this.#lastURL = endpoint
    }

    async fetchEndpoint<T>(endpoint: string): Promise<ResponseShallow<T>>{
        try {
            const response = await fetch(endpoint);
            if( response.ok ) return response.json();
            throw response;
        } catch( error ){
            if( error instanceof Response && error.status === 404){
                throw new Error('Not Found')
            } else {
                throw error;
            }
        }
    }
}


type Catchable = {
    pokemon: { name: string, url: string },
}

export type MapLocation = {
  name: string;
  url: string;
};
/** Location Area endpoint responses - with search params or not / default limit to 20  */
export type EndpointMap = {
    next: string; // URL for the next 20
    previous: string; // URL for the previous 20
    count: number; // total locations
    results: MapLocation[] // 20 locations
}

/** One Location Area endpoint  */
export type EndpointExplore = {
    pokemon_encounters: Catchable[];
}

/** Pokemon endpoint response */
export type EndpointCatch = {
    base_experience: number;
    name: string;
}


/** Generic Response Shallow type */
export type ResponseShallow<T> = T