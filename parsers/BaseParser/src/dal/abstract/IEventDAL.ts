import { EventType } from "../../../../../EventService/src/components/events/enums/event_type.enum";
import { EventStatus } from "../../../../../EventService/src/components/events/enums/event_status.enum";

/**
 * Created by   on 3/5/2017.
 */
export interface IEventDAL {
    addEvent(id: string, type: EventType, mapId: number, eventName: string, startDate: Date, status: EventStatus, sportId: string, countryId: string, leagueId: string);
    getEvents(type: EventType, startDateFrom: Date, startDateTo: Date): Promise<any[]>;
    updateEvent(id: string, status: EventStatus);
}