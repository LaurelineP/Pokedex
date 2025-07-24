export type CacheEntry<T> = {
    createdAt: number;
    value: T;
}
/** Caches API responses */
export class CacheAPI<T> {
    #cache = new Map<string, CacheEntry<any>>()
    /** MS time interval  */
    #interval: number = -1;
    /** Cleanup timer id */
    #reapIntervalID?: NodeJS.Timeout;

    constructor(interval: number){
        this.#interval = interval;
        this.#startReapLoop()
    }

    #reap(){
        [...this.#cache].forEach(([k, v]) => {
            const isPastDue = v.createdAt < (Date.now() - this.#interval)
            if( isPastDue ) this.#cache.delete(k);
        })
    }

    #startReapLoop(){
        this.#reapIntervalID = setInterval(() => {
            this.#reap()
        }, this.#interval)
    }

    stopReapLoop(){
        clearInterval(this.#reapIntervalID);
        this.#reapIntervalID = undefined;
        
    }

    add<T>(key: string, value: any){
        this.#cache.set(key, {createdAt: Date.now(), value})

    }

    get<T>(key: string){
        return this.#cache.get(key)
    }
}