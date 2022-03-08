export function getMaxValue(popularityHashMap: Map<any, any>): string {
    let maxCount = 0, popularBrand;
    popularityHashMap.forEach((value, key) => {
        if (maxCount < value) {
            popularBrand = key;
            maxCount = value;
            }
        });
        
    return popularBrand;
}