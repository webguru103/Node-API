/**
 * Created by   on 3/4/2017.
 */
import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { MessageHandlerBase } from "../../../CommonJS/src/messaging/MessageHandlerBase";
import { ICategoryMappingService } from "../bll/abstract/ICategoryMappingService";
import { CategoryMappingService } from "../bll/services/CategoryMappingService";
import { IEventMappingService } from "../bll/abstract/IEventMappingService";
import { EventMappingService } from "../bll/services/EventMappingService";
import { IMarketMappingService } from "../bll/abstract/IMarketMappingService";
import { MarketMappingService } from "../bll/services/MarketMappingService";
import { ISelectionMappingService } from "../bll/abstract/ISelectionMappingService";
import { SelectionMappingService } from "../bll/services/SelectionMappingService";
import { IEventMarketMappingService } from "../bll/abstract/IEventMarketMappingService";
import { IEventSelectionMappingService } from "../bll/abstract/IEventSelectionMappingService";
import { EventMarketMappingService } from "../bll/services/EventMarketMappingService";
import { EventSelectionMappingService } from "../bll/services/EventSelectionMappingService";
import { EventStatus } from "../../../EventService/src/components/events/enums/event_status.enum";
import { ParticipantMappingService } from "../components/participant/services/participant.mapping.service";

const categoryService: ICategoryMappingService = new CategoryMappingService();
const eventService: IEventMappingService = new EventMappingService();
const marketService: IMarketMappingService = new MarketMappingService();
const selectionService: ISelectionMappingService = new SelectionMappingService();
const participantService = new ParticipantMappingService();
const eventMarketService: IEventMarketMappingService = new EventMarketMappingService();
const eventSelectionService: IEventSelectionMappingService = new EventSelectionMappingService();
const categoryMappingService: ICategoryMappingService = new CategoryMappingService();

export class MessageHandler extends MessageHandlerBase {
    protected async handleMessage(message: any): Promise<any> {
        const body = message.body;
        switch (message.code) {
            case CommunicationCodes.ADD_CATEGORY_MAPPING:
                return categoryService.addCategoryMapping(body.providerCategoryId, body.providerParentCategoryId, body.providerId, body.providerCategoryName, body.categoryType, body.providerSportId);
            case CommunicationCodes.MAP_CATEGORY:
                return categoryService.mapCategory(body.system_category_id, body.provider_id, body.provider_objects_id, body.category_type);
            case CommunicationCodes.APPEND_MAP_CATEGORY:
                return categoryService.appendMapCategory(body.system_category_id, body.provider_id, body.provider_objects_id, body.category_type);
            case CommunicationCodes.UN_MAP_CATEGORY:
                return categoryService.unMapCategory(body.system_category_id, body.provider_id);
            case CommunicationCodes.UN_MAP_PROVIDER_CATEGORY:
                return categoryService.unMapProviderCategory(body.provider_category_id, body.category_type, body.provider_id);
            case CommunicationCodes.UN_MAP_CATEGORY_FOR_ALL_PROVIDERS:
                return categoryService.unMapCategoryForAllProviders(body.system_category_id);
            case CommunicationCodes.GET_CATEGORY_MAPPINGS_BY_PROVIDER_ID:
                return categoryService.getCategoryMappingsByProviderId(body.system_category_id, body.provider_id);
            case CommunicationCodes.GET_UNMAPED_CATEGORIES_BY_PROVIDER_ID:
                return categoryService.getUnMappedCategoriesByProviderIdAndTypeId(body.provider_id, body.type_id);
            case CommunicationCodes.GET_CATEGORY_MAPPING:
                return categoryService.getMapping(body.provider_id, body.provider_category_id, body.category_type);
            case CommunicationCodes.GET_PROVIDER_LEAGUES_BY_SPORT_ID:
                return categoryService.getProviderLeaguesBySportId(body.provider_id, body.sport_id,
                    body.mapped ? JSON.parse(body.mapped) : undefined, body.status, body.page, body.limit);
            //market mapping
            case CommunicationCodes.ADD_MARKET_MAPPING:
                return marketService.addMarketMapping(body.providerId, body.providerMarketId, body.providerCategoryId, body.providerMarketName);
            case CommunicationCodes.MAP_MARKET:
                return marketService.mapMarket(body.providerId, body.mapsId, body.systemMarketId);
            case CommunicationCodes.GET_MARKET_MAPPING:
                return marketService.getMapping(body.providerId, body.providerMarketId, body.providerSportId, true);
            case CommunicationCodes.MAP_MARKET_WITH_SELECTIONS:
                return marketService.mapMarketWithSelections(body.providerId, body.systemMarketId, body.marketMappings, body.selectionMappings);
            case CommunicationCodes.UN_MAP_MARKET:
                return marketService.unMapMarket(body.providerId, body.providerMarketId);
            case CommunicationCodes.UN_MAP_EVENT_MARKET_CASCADE_BY_MARKET_ID:
                return eventMarketService.unmapMarketCascade(body.system_market_id, body.unmap_template != undefined ? body.unmap_template : false);
            case CommunicationCodes.GET_MARKET_MAPPINGS_BY_PROVIDER_ID:
                return marketService.getMarketMappingsByProviderId(body.systemMarketId, body.providerId);
            case CommunicationCodes.GET_UNMAPPED_MARKETS_BY_PROVIDER_ID_AND_SPORT_ID:
                return marketService.getUnmappedMarketsByProviderIdAndSportId(body.providerId, body.sportId);
            //selection mapping
            case CommunicationCodes.ADD_SELECTION_MAPPING:
                return selectionService.addMapping(body.providerId, body.providerSelectionId.toString().toLowerCase(), body.providerSelectionName.toString().toLowerCase(), body.providerMarketId, body.providerCategoryId);
            case CommunicationCodes.MAP_SELECTION:
                return selectionService.map(body.providerId, body.mapId, body.systemSelectionId);
            case CommunicationCodes.UN_MAP_SELECTION:
                return selectionService.unMap(body.providerId, body.providerSelectionId);
            case CommunicationCodes.UN_MAP_SYSTEM_SELECTION:
                return selectionService.unMapSystemSelection(body.id);
            case CommunicationCodes.GET_SELECTIONS_MAPPINGS_BY_PROVIDER_ID_AND_MARKET_ID:
                return selectionService.getMappingsByProviderIdAndMarketId(body.providerId, body.providerMarketId, body.systemCategoryId);
            //category mapping
            case CommunicationCodes.MAP_EVENT:
                return eventService.map(body.provider_id, body.type, body.start_date, body.provider_event_id, body.provider_sport_id,
                    body.provider_country_id, body.provider_league_id, body.provider_participant_ids, body.provider_event_name);
            case CommunicationCodes.GET_EVENT_MAPPINGS_BY_PROVIDER_ID_AND_EVENT_ID:
                return eventService.getMappingByProviderIdAndEventId(body.providerId, body.providerEventId);
            case CommunicationCodes.GET_EVENT_MAPPINGS:
                return eventService.getMappings(body.systemEventId);
            case CommunicationCodes.GET_EVENTS_PROVIDERS:
                return eventService.getEventsProviders(body);
            //participant mapping
            case CommunicationCodes.ADD_PARTICIPANT_MAPPING:
                return participantService.add(body);
            case CommunicationCodes.UPDATE_PARTICIPANT_MAPPING:
                return participantService.update(body);
            case CommunicationCodes.GET_PROVIDER_PARTICIPANTS_BY_SPORT_ID:
                return participantService.getProviderParticipantsBySportId(body);
            case CommunicationCodes.GET_PARTICIPANT_MAPPING:
                return participantService.get(body);
            case CommunicationCodes.GET_PARTICIPANT_MAPPINGS:
                return participantService.list(body);
            case CommunicationCodes.UPDATE_PARTICIPANTS_MAPPINGS:
                return participantService.updateParticipantMappings();
            case CommunicationCodes.MAP_PARTICIPANT:
                return participantService.mapParticipant(body.system_participant_id, body.maps);
            // 
            case CommunicationCodes.MAP_EVENT_MARKET:
                return eventMarketService.map(body.providerId, body.providerEventMarketId, body.providerMarketTypeId,
                    body.providerSportId, body.providerEventId, body.statusId || EventStatus.ACTIVE, true);
            case CommunicationCodes.MAP_EVENT_SELECTION:
                return eventSelectionService.map(body.providerId, body.providerEventSelectionId.toString().toLowerCase(), body.providerSelectionId.toString().toLowerCase(),
                    body.providerMarketId, body.providerEventMarketId, body.argument, body.providerCategoryId, true);
            case CommunicationCodes.GET_EVENT_SELECTIONS_BY_PROVIDER_ID_AND_EVENT_ID:
                return eventSelectionService.getEventSelectionsByEventIdAndProviderId(body.provider_id, body.event_id);
            case CommunicationCodes.GET_EVENT_SELECTIONS_FOR_ALL_PROVIDERS_BY_EVENT_ID:
                return eventSelectionService.getEventSelectionsForAllProvidersByEventId(body.event_id);
            case CommunicationCodes.MAP_UNMAPPED_EVENT_SELECTIONS:
                return eventSelectionService.mapUnMappedEventSelections(body.providerId, body.providerSportId, body.providerMarketId, body.providerSelectionId);
            case CommunicationCodes.GET_PROVIDERS_ODDS_BY_SELECTIONS_IDS:
                return eventSelectionService.getProviderOddsByEventMarketId(body.event_market_id);
            case CommunicationCodes.GET_EVENT_SELECTIONS_ODDS_BY_PROVIDER:
                return eventSelectionService.getEventSelectionsOddsByProvider(body.provider_id, body.event_selections ? body.event_selections.split(",") : []);
            case CommunicationCodes.GET_EVENT_SELECTIONS_ODDS_BY_ALL_PROVIDERS:
                return eventSelectionService.getEventSelectionsOddsByAllProviers(body.event_selections ? body.event_selections.split(",") : []);
            case CommunicationCodes.GET_EVENT_SELECTIONS_BEST_PROVIDER_ODDS:
                return eventSelectionService.getEventSelectionsBestProviderOdds(body.event_selections ? body.event_selections.split(",") : []);
            case CommunicationCodes.GET_EVENT_SELECTIONS_BY_PROVIDER_ID_AND_PROVIDER_SELECTION_ID:
                return eventSelectionService.getEventSelectionsByProviderEventSelectionId(body.provider_id, body.selections);
            case CommunicationCodes.UN_MAP_EVENTS:
                return eventService.unMapEvents(body.events_id);
            case CommunicationCodes.MERGE_CATEGORIES:
                return categoryService.mergeCategories(body.system_old_category_id, body.system_new_category_id);
            case CommunicationCodes.UPDATE_CATEGORY_MAPPING:
                return categoryMappingService.update(body);
            case CommunicationCodes.UPDATE_CATEGORY_MAPPINGS:
                return categoryMappingService.updateMany(body);
        }
    }
}