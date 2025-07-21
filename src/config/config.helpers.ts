import { EnvError } from "./config.errors.js";


export const getOrThrowEnvVariable = (key: string): string  => {
    try {
        const envValue = process.env?.[ key ];
        if(!envValue) throw new EnvError('Environment variable not found.')
        return process.env[ key ] as string;
    } catch( error ){
        throw error
    }
}
