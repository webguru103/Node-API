/**
 * Created by   on 3/27/2017.
 */
export interface IMarketMappingService {
    addWarning(providerId: number, providerMarketId: string, providerMarketName: string, providerSportId: string);
    removeWarning(providerId: number, providerMarketId: number, providerSportId: string);
    getWarnings(page: number, limit: number);
    getWarningsCount();
}