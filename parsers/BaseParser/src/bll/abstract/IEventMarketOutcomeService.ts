/**
 * Created by   on 3/5/2017.
 */
import { EventStatus } from "../../../../../EventService/src/components/events/enums/event_status.enum";

export interface IEventMarketOutcomeService {
    addEventMarketOutcome(id: string, name: string, type: string, marketType: string, eventMarketId: string, providerCategoryId: string, odd: number, status: EventStatus, argument: string);
    getEventMarketOutcome(id: string);
    updateEventMarketOutcome(id: string, odd: number, status: EventStatus, mapId: number);
}