/**
 * Created by   on 3/5/2017.
 */
import { IFeedParticipant } from "../../interfaces/IFeedParticipant";
import { EventStatus } from "../../../../../EventService/src/components/events/enums/event_status.enum";
import { EventType } from "../../../../../EventService/src/components/events/enums/event_type.enum";

export interface IEventService {
    addEvent(id: string, eventName: string, type: EventType, startDate: Date, status: EventStatus, sportId: string, countryId: string, leagueId: string, participants: IFeedParticipant[]);
    getEvents(type: EventType, startDateFrom: Date, startDateTo: Date): Promise<any[]>;
    updateEvent(id: string, status: EventStatus);
}