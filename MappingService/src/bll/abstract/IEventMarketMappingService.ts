/**
 * Created by   on 3/4/2017.
 */
import { IEventMarketMapping } from "../../components/event_market/interfaces/event_market.mapping.interface";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";

export interface IEventMarketMappingService {
    map(providerId: number, providerEventMarketId: string, providerMarketTypeId: string,
        providerSportId: string, providerEventId: string, statusId:EventStatus, sendWarning: boolean): Promise<number>;
    getMapping(providerId: number, providerEventMarketId: string): Promise<IEventMarketMapping>;
    unmapMarketCascade(marketId: number, unmapTemplete: boolean): Promise<any>
}