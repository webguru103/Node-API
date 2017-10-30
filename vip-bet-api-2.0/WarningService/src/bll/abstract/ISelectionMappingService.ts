/**
 * Created by   on 3/27/2017.
 */
export interface ISelectionMappingService {
    addWarning(providerId: number, providerSelectionId: string, providerSelectionName: string, providerMarketId: string, providerSportId: string);
    removeWarning(providerId: number, providerSelectionId: string, providerSportId: string, providerMarketId: string);
    getWarnings(page: number, limit: number);
    getWarningsCount();
}