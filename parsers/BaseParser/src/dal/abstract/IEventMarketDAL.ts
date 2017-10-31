import { EventStatus } from "../../../../../EventService/src/components/events/enums/event_status.enum";

/**
 * Created by   on 3/5/2017.
 */

export interface IEventMarketDAL {
    addEventMarket(id: string, name: string, status: EventStatus, eventId: string, marketTypeId: string, mapId: number);
    updateEventMarket(id: string, status: EventStatus);
    
}