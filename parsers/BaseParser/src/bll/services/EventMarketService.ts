/**
 * Created by   on 3/5/2017.
 */
import { IEventMarketService } from "../abstract/IEventMarketService";
import { IEventMarketDAL } from "../../dal/abstract/IEventMarketDAL";
import { EventMarketDAL } from "../../dal/EventMarketDAL";
import { ServiceBase, broker } from "../../../../../CommonJS/src/bll/services/ServiceBase";
import { CommunicationCodes } from "../../../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../../../CommonJS/src/messaging/QueueType";
import { toNumber } from "lodash";
import { EventStatus } from "../../../../../EventService/src/components/events/enums/event_status.enum";

export class EventMarketService extends ServiceBase implements IEventMarketService {
    private eventMarketDAL: IEventMarketDAL = new EventMarketDAL();

    async addEventMarket(id: string, name: string, status: EventStatus, eventId: string, marketTypeId: string, providerSportId: string, marketTypeName?: string) {
        id = id.toString();
        eventId = eventId.toString();
        marketTypeId = marketTypeId.toString();
        providerSportId = providerSportId.toString();

        await broker.sendRequest(CommunicationCodes.ADD_MARKET_MAPPING, {
            providerId: ServiceBase.providerId,
            providerMarketId: marketTypeId,
            providerMarketName: marketTypeName || marketTypeId,
            providerCategoryId: providerSportId
        }, QueueType.MAPPING_SERVICE);

        let mapId = await broker.sendRequest(CommunicationCodes.MAP_EVENT_MARKET, {
            providerEventMarketId: id,
            providerId: ServiceBase.providerId,
            providerMarketTypeId: marketTypeId,
            providerSportId: providerSportId,
            providerEventId: eventId,
            statusId: status
        }, QueueType.MAPPING_SERVICE);

        mapId = toNumber(mapId);
        if (mapId === 0) return;
        return this.eventMarketDAL.addEventMarket(id, name, status, eventId, marketTypeId, mapId);
    }

    updateEventMarket(id: string, status: EventStatus) {
        return this.eventMarketDAL.updateEventMarket(id, status);
    }
}