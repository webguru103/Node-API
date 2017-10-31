/**
 * Created by   on 3/4/2017.
 */
import { IMarketMapping } from "../../components/market/interfaces/market.mapping.interface";

export interface IMarketMappingService {
    addMarketMapping(providerId: number, providerMarketId: string, providerCategoryId: string, providerMarketName: string): Promise<number>;
    mapMarket(providerId: number, mapsId: number[], systemMarketId: number): Promise<IMarketMapping[]>;
    mapMarketWithSelections(providerId: number, systemMarketId: number, marketMappings: any[], selectionMappings: any[]);
    unMapMarket(providerId: number, systemMarketId: number);
    getMapping(providerId: number, providerMarketId: string, providerSportId: string, sendWarning: boolean): Promise<IMarketMapping>;
    getMarketMappingsByProviderId(systemMarketId: number, providerId: number);
    getUnmappedMarketsByProviderIdAndSportId(providerId: number, sportId: number);
}