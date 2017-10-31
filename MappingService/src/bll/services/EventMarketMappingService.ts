/**
 * Created by   on 3/4/2017.
 */
import { IEventMarketMappingService } from "../abstract/IEventMarketMappingService";
import { IMarketMappingService } from "../abstract/IMarketMappingService";
import { MarketMappingService } from "./MarketMappingService";
import { IEventMappingService } from "../abstract/IEventMappingService";
import { EventMappingService } from "./EventMappingService";
import { EventMarketMappingDAL } from "../../dal/EventMarketMappingDAL";
import { IEventMarketMappingDAL } from "../../dal/abstract/IEventMarketMappingDAL";
import { CommunicationCodes } from "../../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../../CommonJS/src/messaging/QueueType";
import { broker } from "../../../../CommonJS/src/base/base.model";
import { IEventMarketMapping } from "../../components/event_market/interfaces/event_market.mapping.interface";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";

export class EventMarketMappingService implements IEventMarketMappingService {
    private eventMappingService: IEventMappingService = new EventMappingService();
    private marketMappingService: IMarketMappingService = new MarketMappingService();
    private eventMarketMappingDAL: IEventMarketMappingDAL = new EventMarketMappingDAL();

    async map(providerId: number, providerEventMarketId: string, providerMarketTypeId: string, providerSportId: string,
        providerEventId: string, statusId: EventStatus, sendWarning: boolean = true): Promise<number> {
        // get event market by marketType and eventId
        // get market mapping if mapping does not exist return
        // get event mapping if exist and add mapping for event market anyway
        // if market is not mapped return error that market not mapped
        // find eventMarket by marketType and argument
        // if eventMarket exist map with that eventMarketId
        // if not insert new eventMarket, get that eventMarketId and map with that id
        let mapId: number = 0;
        // if already mapped return map id
        const alreadyMapped = await this.eventMarketMappingDAL.getMapping(providerId, providerEventMarketId);
        if (alreadyMapped && alreadyMapped.system_event_market_id) return alreadyMapped.id;
        // 
        if (alreadyMapped) {
            // if market already mapped set map_id
            mapId = alreadyMapped.id;
            if (alreadyMapped.system_event_market_id) return mapId;
        }
        // get event mapping
        const eventMapping = await this.eventMappingService.getMappingByProviderIdAndEventId(providerId, providerEventId);
        // if event mapping does not exist return
        if (!eventMapping || !eventMapping.system_event_id) return mapId;
        // get market mapping
        const marketMapping = await this.marketMappingService.getMapping(providerId, providerMarketTypeId, providerSportId, sendWarning);
        // if mapping does not exist return
        if (!marketMapping) return mapId;
        // if market is not mapped return map_id
        if (marketMapping.system_market_id == null) return mapId;
        // if not mapped
        if (!alreadyMapped) {
            // add mapping and get map_id
            mapId = await this.eventMarketMappingDAL.addMap(providerId, providerEventMarketId, providerMarketTypeId,
                providerEventId, providerSportId);
        }
        // add event market
        const eventMarketId: number = await broker.sendRequest(CommunicationCodes.ADD_EVENT_MARKET, {
            event_id: eventMapping.system_event_id,
            market_id: marketMapping.system_market_id
        }, QueueType.EVENT_MARKET_SERVICE);
        // map event market
        await this.eventMarketMappingDAL.map(mapId, eventMarketId);
        // return map_id
        return mapId;
    }

    async getMapping(providerId: number, providerEventMarketId: string): Promise<IEventMarketMapping> {
        return this.eventMarketMappingDAL.getMapping(providerId, providerEventMarketId);
    }

    async unmapMarketCascade(marketId: number, unmapTemplete: boolean = false): Promise<any> {
        return this.eventMarketMappingDAL.unMapEventMarketsWithEventSelectionsByMarketId(marketId, unmapTemplete);
    }
}