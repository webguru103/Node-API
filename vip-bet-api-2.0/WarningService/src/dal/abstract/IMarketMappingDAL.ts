/**
 * Created by   on 3/27/2017.
 */
export interface IMarketMappingDAL {
    addWarning(providerId: number, providerMarketId: string, providerMarketName: string, providerSportId: string, providerSportName: string);
    removeWarning(providerId: number, providerMarketId: number, providerSportId: string);
    getWarnings(page: number, limit: number);
    getWarningsCount();
}