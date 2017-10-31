/**
 * Created by   on 3/4/2017.
 */
import { IEventMarketMapping } from "../../components/event_market/interfaces/event_market.mapping.interface";

export interface IEventMarketMappingDAL {
    addMap(providerId: number, providerEventMarketId: string, providerMarketId: string, providerEventId: string, providerSportId: string): Promise<number>;
    map(mapId: number, systemEventMarketId: number): Promise<IEventMarketMapping>;
    getMapping(providerId: number, providerEventMarketId: string): Promise<IEventMarketMapping>;
    getMappings(systemEventMarketId: number): Promise<IEventMarketMapping[]>;
    getUnMappedEventMarkets(providerId: number, providerSportId: string, providerMarketId: string);
    unMapEventMarketsWithEventSelectionsByMarketId(marketId: number, unmapTemplete: boolean): Promise<any>
}