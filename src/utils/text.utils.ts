
export const getSpaceSeparator = (value: string) => {
    return value.length > 4 ? '\t' : '\t\t'
}

export const capitalize = (value:string) => {
    return value.slice(0,1).toUpperCase() + value.slice(1);
}



export const formatSpecToTexts = (data: object & { isCaught: boolean }) => {
    /* Gets entries from data and nested data */
    const entries = Object.entries(data).map(([key, valueOrValues]) => {
        const capitalizedKey = capitalize(key);
        if( key === 'stats' && Array.isArray( valueOrValues )) {
            const flattenStats = valueOrValues.flatMap(Object.entries)
            return [
                capitalizedKey,
                flattenStats
            ]
        }
        return [capitalizedKey, valueOrValues]
    })


    const texts = entries.flatMap(([key, valueOrValues ]) => {
        if( Array.isArray( valueOrValues )){
            return [ key, valueOrValues ]
        } else {
            return [ key, valueOrValues ].join(':\t')
        }
    })
    return texts
}