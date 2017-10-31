/**
 * Created by   on 3/4/2017.
 */
import { IEventSelectionMapping } from "../../components/event_selection/interfaces/event_selection.mapping.interface";
import { IEventSelection } from "../../../../EventMarketService/src/components/event.selection/interfaces/event.selection.interface";

export interface IEventSelectionMappingService {
    map(providerId: number, providerEventSelectionId: string, providerSelectionId: string, providerMarketId: string,
        providerEventMarketId: string, argument: string, providerCategoryId: string, sendWarning: boolean): Promise<number>;
    getEventSelectionsByEventIdAndProviderId(providerId: number, eventId: string);
    getEventSelectionsForAllProvidersByEventId(eventId: string);
    getEventSelectionsOddsByProvider(providerId: number, eventSelectionsId: number[]): Promise<IEventSelection[] | undefined>;
    getEventSelectionsOddsByAllProviers(eventSelectionsId: number[]): Promise<any>;
    getEventSelectionsBestProviderOdds(eventSelectionsId: number[]): Promise<any>;
    mapUnMappedEventSelections(providerId: number, providerSportId: string, providerMarketId: string, providerSelectionId: string);
    getProviderOddsByEventMarketId(eventMarketId: number);
    getEventSelectionsByProviderEventSelectionId(providerId: number, providerEventSelections: number[]): Promise<IEventSelectionMapping[]>
}