/**
 * Created by   on 3/4/2017.
 */
import { IEventSelectionMapping } from "../../components/event_selection/interfaces/event_selection.mapping.interface";

export interface IEventSelectionMappingDAL {
    addMap(providerId: number, providerEventSelectionId: string, providerEventMarketId: string, providerSportId: string, providerMarketId: string, providerSelectionId: string, argument: string);
    map(mapId: number, systemEventId: number);
    getMapping(providerId: number, providerEventSelectionId: string, providerEventMarketId: string);
    getEventSelectionsByEventIdAndProviderId(providerId: number, eventId: string);
    getEventSelectionsByEventId(providers: number[], eventId: string): Promise<{ [key: number]: IEventSelectionMapping[] }>
    getEventSelectionsByProviderId(providerId: number, eventSelectionsIds: number[]): Promise<IEventSelectionMapping[]>;
    getUnMappedEventSelections(providerId: number, providerSportId: string, providerMarketId: string, providerSelectionId: string): Promise<IEventSelectionMapping[]>;
    getMapIdsByEventMarketId(eventMarketId: number);
}