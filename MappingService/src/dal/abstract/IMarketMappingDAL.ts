/**
 * Created by   on 3/4/2017.
 */
import { IMarketMapping } from "../../components/market/interfaces/market.mapping.interface";

export interface IMarketMappingDAL {
    addMarketMapping(providerId: number, providerMarketId: string, providerCategoryId: string, providerMarketName: string): Promise<number>;
    mapMarket(mapId: number, systemMarketId: number): Promise<IMarketMapping>;
    unMapMarket(providerId: number, systemMarketId: number);
    getMapping(providerId: number, providerMarketId: string, providerSportId: string): Promise<IMarketMapping>;
    getProviderMarketId(mapId: number);
    getMappedProviders(systemMarketId: number): Promise<any[]>;
    getMappedMarket(providerId: number, providerMarketId: string);
    getMarketMappingsByProviderId(systemMarketId: number, providerId: number): Promise<any[]>;
    getUnmappedMarketsByProviderIdAndSportId(providerId: number, sportId: number);
}