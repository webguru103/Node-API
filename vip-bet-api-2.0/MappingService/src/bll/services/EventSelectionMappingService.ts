/**
 * Created by   on 3/4/2017.
 */
import { ErrorCodes, ErrorUtil } from "../../../../CommonJS/src/messaging/ErrorCodes";
import { CommunicationCodes } from "../../../../CommonJS/src/messaging/CommunicationCodes";
import { isNummericArray } from "../../../../CommonJS/src/utils/validators";
import { QueueType } from "../../../../CommonJS/src/messaging/QueueType";
import { IEventSelectionMappingService } from "../abstract/IEventSelectionMappingService";
import { ISelectionMappingService } from "../abstract/ISelectionMappingService";
import { SelectionMappingService } from "./SelectionMappingService";
import { IEventSelectionMappingDAL } from "../../dal/abstract/IEventSelectionMappingDAL";
import { EventSelectionMappingDAL } from "../../dal/EventSelectionMappingDAL";
import { IEventMarketMappingService } from "../abstract/IEventMarketMappingService";
import { EventMarketMappingService } from "./EventMarketMappingService";
import { map, reduce } from "bluebird";
import { ProviderFactory } from "../../providers/ProviderFactory";
import { toNumber, isNumber, round } from "lodash";
import { broker, QueryBuilder, BaseModel } from "../../../../CommonJS/src/base/base.model";
import { IEventSelectionMapping } from "../../components/event_selection/interfaces/event_selection.mapping.interface";
import { EventMappingService } from "./EventMappingService";
import { IEventMappingService } from "../abstract/IEventMappingService";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";
import { IProviderInfo, IEventSelection, IProviderSelections } from "../../../../EventMarketService/src/components/event.selection/interfaces/event.selection.interface";
import { Provider } from "../../../../CommonService/src/components/provider/models/provider.model";
import { IProviderOdd } from "../../../../EventMarketService/src/components/event.selection/interfaces/event.selection.interface";

export class EventSelectionMappingService implements IEventSelectionMappingService {
    private selectionMappingService: ISelectionMappingService = new SelectionMappingService();
    private eventSelectionMappingDAL: IEventSelectionMappingDAL = new EventSelectionMappingDAL();
    private eventMarketMappingService: IEventMarketMappingService = new EventMarketMappingService();
    private eventMappingService: IEventMappingService = new EventMappingService();

    async map(providerId: number, providerEventSelectionId: string, providerSelectionId: string, providerMarketId: string,
        providerEventMarketId: string, argument: string, providerCategoryId: string, sendWarning: boolean = true): Promise<number> {
        //if already mapped return map id
        const alreadyMapped = await this.eventSelectionMappingDAL.getMapping(providerId, providerEventSelectionId, providerEventMarketId);
        if (alreadyMapped && alreadyMapped.system_event_selection_id) return alreadyMapped.id;
        // 
        let mapId: number = 0;
        // get event market mapping
        const eventMarketMapping = await this.eventMarketMappingService.getMapping(providerId, providerEventMarketId);
        if (!eventMarketMapping || !eventMarketMapping.system_event_market_id) return mapId;
        // get event selection mapping
        const selectionMapping = await this.selectionMappingService.getMapping(providerId, providerSelectionId, providerMarketId, providerCategoryId, sendWarning);
        if (!selectionMapping) return mapId;
        if (!selectionMapping.system_selection_id) return mapId;
        //get selection mapping if selection row missing reject
        //get event market mapping if event market is not mapped reject
        //add event selection mapping
        //if market is not mapped return error that market not mapped
        //find eventMarket by marketType and argument
        //if eventMarket exist map with that eventMarketId
        //if not insert new eventMarket, get that eventMarketId and map with that id
        if (alreadyMapped) {
            mapId = alreadyMapped.id;
            if (alreadyMapped.system_event_selection_id) return mapId;
        } else {
            mapId = await this.eventSelectionMappingDAL.addMap(providerId, providerEventSelectionId,
                providerEventMarketId, providerCategoryId, providerMarketId, providerSelectionId, argument);
        }
        // add event selection
        const eventSelectionId = await broker.sendRequest(CommunicationCodes.ADD_EVENT_SELECTION, {
            eventMarketId: eventMarketMapping.system_event_market_id,
            selectionId: selectionMapping.system_selection_id,
            argument: argument
        }, QueueType.EVENT_MARKET_SERVICE);
        // map event selection
        await this.eventSelectionMappingDAL.map(mapId, eventSelectionId);
        return mapId;
    }

    async getEventSelectionsByEventIdAndProviderId(providerId: number, eventId: string): Promise<any> {
        if (!isNumber(Number(providerId)) || !isNumber(Number(eventId))) throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST);
        // get event mapping
        const eventMapping = await this.eventMappingService.getMapping(providerId, toNumber(eventId));
        // if event not mapped return
        if (!eventMapping) return;
        // get selection mappings
        const mappings: any[] = await this.eventSelectionMappingDAL.getEventSelectionsByEventIdAndProviderId(providerId, eventId);
        // return selections
        return this.getSelectionsOdds(providerId, mappings);
    }

    async getEventSelectionsForAllProvidersByEventId(eventId: string): Promise<any> {
        if (!isNumber(Number(eventId))) throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST);
        // get event mapping
        const eventMappings = await this.eventMappingService.getMappings(toNumber(eventId));
        // if event not mapped return
        if (eventMappings.length === 0) return;
        // get selection mappings
        const mappings = await this.eventSelectionMappingDAL.getEventSelectionsByEventId(eventMappings.map(e => e.provider_id), eventId);
        // return selections
        return map(Object.keys(mappings).map(k => toNumber(k)), async providerId => {
            return {
                provider_id: providerId,
                selections: await this.getSelectionsOdds(providerId, mappings[providerId])
            }
        });
    }

    async getEventSelectionsOddsByProvider(providerId: number, eventSelectionsId: number[]): Promise<IEventSelection[]> {
        if (!isNumber(Number(providerId)) || !isNummericArray(eventSelectionsId)) throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST);
        // if event selections empty return
        if (eventSelectionsId.length == 0) return [];
        // get event selections from event market service
        const eventSelections: IEventSelection[] = await broker.sendRequest(CommunicationCodes.GET_EVENT_SELECTIONS, {
            event_selections: eventSelectionsId
        }, QueueType.EVENT_MARKET_SERVICE);
        // get event selections mappings
        const mappings: any[] = await this.eventSelectionMappingDAL.getEventSelectionsByProviderId(providerId, eventSelectionsId);
        // get odds from provider
        const selections = await this.getSelectionsOdds(providerId, mappings);
        // return event selections
        return map(eventSelections, async eventSelection => {
            const selectionKey = Object.keys(selections).find(k => { return eventSelection.id == toNumber(k) });
            if (selectionKey) {
                eventSelection.odd = selections[selectionKey].odd;
            } else {
                eventSelection.status_id = EventStatus.SUSPENDED;
            }
            return eventSelection;
        })
    }

    async getEventSelectionsOddsByAllProviers(eventSelectionsId: number[]): Promise<IProviderSelections[]> {
        if (!isNummericArray(eventSelectionsId)) throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST);
        if (eventSelectionsId.length == 0) return [];
        const providers: Provider[] = await broker.sendRequest(CommunicationCodes.GET_ALL_PROVIDERS, {}, QueueType.COMMON_SERVICE);
        return map(providers, async provider => {
            const providerInfo = <IProviderInfo>{
                id: provider.id,
                name: provider.name
            };
            const data = await this.getEventSelectionsOddsByProvider(provider.id, eventSelectionsId);
            if (data.length > 0) {
                providerInfo.total_odd = data
                    .map(es => toNumber(es.odd))
                    .reduce((prev, next) => {
                        if (prev > 0 && next == 0) return prev;
                        else if (prev > 0 && next > 0) return prev * next;
                        return 0;
                    });
            }
            if (providerInfo.total_odd) providerInfo.total_odd = round(providerInfo.total_odd, 2);
            return <IProviderSelections>{ provider: providerInfo, selections: data };
        })
    }

    async getEventSelectionsBestProviderOdds(eventSelectionsId: number[]): Promise<any> {
        if (!isNummericArray(eventSelectionsId)) throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST);
        if (eventSelectionsId.length == 0) return;
        const providersOdds = await this.getEventSelectionsOddsByAllProviers(eventSelectionsId);
        // get best provider
        const best = reduce(providersOdds, async (prev: IProviderSelections, current) => {
            // calc previous provider odds
            const prevProvider = prev.selections
                .filter(p => p.odd !== undefined)
                .map(s => <number>s.odd)
                .reduce((a, b) => { return a * b });
            // calc current provider odds
            const currentProvider = prev.selections
                .filter(p => p.odd !== undefined)
                .map(s => <number>s.odd)
                .reduce((a, b) => { return a * b });
            // return better one
            return prevProvider > currentProvider ? prev : current
        })
        // return best provider
        return best;
    }

    private async getSelectionsOdds(providerId: number, mappings: any[]): Promise<{ [key: string]: any }> {
        if (!isNumber(Number(providerId))) throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST);
        const mapIds: any[] = [];
        const mapToSystemIds: { [key: number]: IProviderOdd } = {};
        const systemSelections = {};
        await map(mappings, async mapping => {
            mapIds.push(mapping.id);
            mapToSystemIds[mapping.id] = mapping;
            systemSelections[mapping.system_event_selection_id] = mapping;

            delete mapping.provider_id;
            delete mapping.system_event_selection_id;
            delete mapping.id;
        })
        // get provider
        const provider = ProviderFactory.getProvider(Number(providerId));
        // if there is no such provider return error
        if (!provider) throw ErrorUtil.newError(ErrorCodes.UNKNOWN_PROVIDER);
        // get provider odds
        const odds: any[] = await provider.getOdds(mapIds);
        // set odds and statuses
        await map(odds, async odd => {
            mapToSystemIds[odd.map_id].odd = odd.odd;
            mapToSystemIds[odd.map_id].status = odd.status;
        })
        // return odds
        return systemSelections;
    }

    async mapUnMappedEventSelections(providerId: number, providerSportId: string, providerMarketId: string, providerSelectionId: string): Promise<any> {
        const selections = await this.eventSelectionMappingDAL.getUnMappedEventSelections(providerId, providerSportId, providerMarketId, providerSelectionId);
        return map(selections, async (selection: IEventSelectionMapping) => {
            const eventSelectionId = selection.provider_event_selection_id;
            const selectionId = selection.provider_selection_id;
            const marketId = selection.provider_market_id;
            const eventMarketId = selection.provider_event_market_id;
            const argument = selection.argument;
            const sportId = selection.provider_sport_id;
            return this.map(providerId, eventSelectionId, selectionId, marketId, eventMarketId, argument, sportId, false);
        });
    }

    async getProviderOddsByEventMarketId(eventMarketId: number): Promise<any> {
        if (!isNumber(Number(eventMarketId))) throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST);
        const maps: any[] = await this.eventSelectionMappingDAL.getMapIdsByEventMarketId(eventMarketId);
        return map(maps, async (map) => {
            if (!map || !map.system_event_selection_id) return;

            const providerId = map.provider_id;
            const provider = ProviderFactory.getProvider(providerId);
            if (!provider) throw ErrorUtil.newError(ErrorCodes.UNKNOWN_PROVIDER, "provider_id:" + providerId);

            const odd = await provider.getOdd(map.id);
            return {
                provider_id: providerId,
                id: map.system_event_selection_id,
                odd: odd == null ? null : odd.odd
            }
        })
    }
    async getEventSelectionsByProviderEventSelectionId(providerId: number, providerEventSelections: number[]): Promise<IEventSelectionMapping[]> {
        const query = QueryBuilder("event_selection_mapping")
            .whereIn("provider_event_selection_id", providerEventSelections)
            .where("provider_id", providerId)
            .select("system_event_selection_id")
            .select("provider_event_selection_id");
        return BaseModel.manyOrNone(query.toString());
    }
}