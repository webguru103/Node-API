import { EventStatus } from "../../../../../EventService/src/components/events/enums/event_status.enum";

/**
 * Created by   on 3/5/2017.
 */

export interface IEventMarketOutcomeDAL {
    addEventMarketOutcome(id: string, mapId: number, name: string, eventMarketId: string, odd: number, status: EventStatus, argument: string);
    getEventMarketOutcome(id: string);
    updateEventMarketOutcome(id: string, odd: number, status: EventStatus, mapId: number);
}