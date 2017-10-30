/**
 * Created by   on 3/4/2017.
 */
export interface ISelectionMappingService {
    addMapping(providerId: number, providerSelectionId: string, providerSelectionName: string, providerMarketId: string, providerCategoryId: string);
    map(providerId: number, mapId: number, systemSelectionId: number);
    getMapping(providerId: number, providerSelectionId: string, providerMarketId: string, providerCategoryId: string, sendWarning: boolean);
    unMap(providerId: number, systemSelectionId: number);
    unMapSystemSelection(systemSelectionId: number);
    unMapMarketSelections(providerId: number, providerMarketId: number);
    getMappingsByProviderIdAndMarketId(providerId: number, providerMarketId: number, systemCategoryId: string);
}