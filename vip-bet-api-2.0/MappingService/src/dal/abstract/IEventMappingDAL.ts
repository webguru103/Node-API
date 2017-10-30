/**
 * Created by   on 3/4/2017.
 */
import { IEventMapping } from "../../components/event/interfaces/event.mapping.interface";

export interface IEventMappingDAL {
    addMap(providerId: number, providerEventId: string, startDate: string): Promise<number>;
    map(mapId: number, systemEventId: number): Promise<IEventMapping>;
    getMappingByProviderIdAndEventId(providerId: number, providerEventId: string): Promise<IEventMapping>;
    getMappings(systemEventId: number): Promise<IEventMapping[]>;
    getMapping(providerId: number, systemEventId: number): Promise<IEventMapping[]>;
    unMapEvents(eventsId: number[]): Promise<any>;
    getEventsProviders(event_ids: number[]): Promise<{ [key: string]: number }[]>
}