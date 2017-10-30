/**
 * Created by   on 3/4/2017.
 */
import { IEventMapping } from "../../components/event/interfaces/event.mapping.interface";
import { Provider } from "../../../../CommonService/src/components/provider/models/provider.model";
import { EventType } from "../../../../EventService/src/components/events/enums/event_type.enum";
export interface IEventMappingService {
    map(providerId: number, type: EventType, startDate: string, providerEventId: string, providerSportId: string,
        providerCountryId: string, providerLeagueId: string, providerParticipantIds: Array<string>, providerEventName: string): Promise<number>;
    getMappingByProviderIdAndEventId(providerId: number, providerEventId: string): Promise<IEventMapping>;
    getMappings(systemEventId: number): Promise<IEventMapping[]>;
    getMapping(providerId: number, systemEventId: number): Promise<IEventMapping[]>;
    unMapEvents(eventsId: number[]): Promise<any>;
    getEventsProviders(event_ids: number[]): Promise<{ [key: string]: Provider[] }>;
}