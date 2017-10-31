/**
 * Created by   on 3/4/2017.
 */
import { IEventMappingService } from "../abstract/IEventMappingService";
import { IEventMappingDAL } from "../../dal/abstract/IEventMappingDAL";
import { EventMappingDAL } from "../../dal/EventMappingDAL";
import { CommunicationCodes } from "../../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../../CommonJS/src/messaging/QueueType";
import { ICategoryMappingService } from "../abstract/ICategoryMappingService";
import { CategoryMappingService } from "./CategoryMappingService";
import { map } from "bluebird";
import { DEFAULT_LANGUAGE } from "../../../../CommonJS/src/domain/constant";
import { Category } from "../../../../CategoryService/src/components/category/models/category.model";
import { broker } from "../../../../CommonJS/src/base/base.model";
import { IEvent } from "../../../../EventService/src/components/events/interfaces/event.interface";
import { IEventMapping } from "../../components/event/interfaces/event.mapping.interface";
import { Participant } from "../../../../ParticipantService/src/components/participants/models/participant.model";
import { Provider } from "../../../../CommonService/src/components/provider/models/provider.model";
import { groupBy, sortBy } from "lodash";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { EventType } from "../../../../EventService/src/components/events/enums/event_type.enum";
import { ParticipantMappingService } from "../../components/participant/services/participant.mapping.service";

export class EventMappingService implements IEventMappingService {
    private eventMappingDAL: IEventMappingDAL = new EventMappingDAL();
    private participantMappingService = new ParticipantMappingService();
    private categoryMappingService: ICategoryMappingService = new CategoryMappingService();

    async map(providerId: number, type: EventType, startDate: string, providerEventId: string, providerSportId: string,
        providerCountryId: string, providerLeagueId: string, providerParticipantIds: string[], providerEventName: string): Promise<number> {
        //if event is not mapped
        //get event participants by provider participants
        //look if that participants playing at same time
        //if yes then set that id to this provider event
        //if that participants are not playing at that date that means it is new event
        //create new event id and assign to this event
        let mapId: number = 0;

        const systemParticipants: any[] = [];
        // get system participants
        await map(providerParticipantIds, async (providerParticipantId) => {
            const mapping = await this.participantMappingService.get({
                provider_id: providerId,
                provider_participant_id: providerParticipantId,
                provider_sport_id: providerSportId
            });
            if (mapping && mapping.system_participant_id) {
                // get system participant
                const participant: Participant = await broker.sendRequest(CommunicationCodes.GET_PARTICIPANT, {
                    id: mapping.system_participant_id
                }, QueueType.PARTICIPANT_SERVICE);
                // set participant in correct index to keep home away order
                systemParticipants[providerParticipantIds.indexOf(providerParticipantId)] = {
                    id: participant.id,
                    name: participant.name
                };
            }
        })

        if (providerParticipantIds.length != systemParticipants.filter(p => p !== undefined).length) return mapId;
        // get sport mapping
        const sportMapping = await this.categoryMappingService.getMapping(providerId, providerSportId, CategoryType.SPORT);
        if (!sportMapping || !sportMapping.system_category_id) return mapId;
        // get league mapping
        const leagueMapping = await this.categoryMappingService.getMapping(providerId, providerLeagueId, CategoryType.LEAGUE);
        if (!leagueMapping || !leagueMapping.system_category_id) return mapId;
        // get league
        const league = <Category>await broker.sendRequest(CommunicationCodes.GET_CATEGORY, {
            id: leagueMapping.system_category_id
        }, QueueType.CATEGORY_SERVICE);
        if (!league) return mapId;
        // get country
        const country = <Category>await broker.sendRequest(CommunicationCodes.GET_CATEGORY, {
            id: league.parent_id
        }, QueueType.CATEGORY_SERVICE);
        if (!country) return mapId;
        // get sport
        const sport = <Category>await broker.sendRequest(CommunicationCodes.GET_CATEGORY, {
            id: sportMapping.system_category_id
        }, QueueType.CATEGORY_SERVICE);
        if (!sport) return mapId;
        //if already mapped return map id
        const alreadyMapped = await this.eventMappingDAL.getMappingByProviderIdAndEventId(providerId, providerEventId);
        if (alreadyMapped && alreadyMapped.system_event_id) return alreadyMapped.id;
        //if mapping record does not exist in event_mapping table add it
        if (alreadyMapped) {
            mapId = alreadyMapped.id;
        } else {
            mapId = await this.eventMappingDAL.addMap(providerId, providerEventId, startDate);
        }
        // add event
        const event: IEvent = await broker.sendRequest(CommunicationCodes.ADD_EVENT, {
            start_date: startDate,
            participants: systemParticipants.map(p => p.id),
            league_id: league.id,
            league_status_id: league.status_id,
            country_id: country.id,
            country_status_id: country.status_id,
            sport_id: sport.id,
            sport_status_id: sport.status_id,
            lang_id: DEFAULT_LANGUAGE,
            name: systemParticipants.map(p => p.name).join(" - "),
            type_id: type
        }, QueueType.EVENT_SERVICE);
        await this.eventMappingDAL.map(mapId, event.id);
        return mapId;
    }

    async getMappingByProviderIdAndEventId(providerId: number, providerEventId: string): Promise<IEventMapping> {
        return this.eventMappingDAL.getMappingByProviderIdAndEventId(providerId, providerEventId);
    }

    async getMappings(systemEventId: number): Promise<IEventMapping[]> {
        return this.eventMappingDAL.getMappings(systemEventId);
    }

    async getMapping(providerId: number, systemEventId: number): Promise<IEventMapping[]> {
        return this.eventMappingDAL.getMapping(providerId, systemEventId);
    }

    async unMapEvents(eventsId: number[]): Promise<any> {
        return this.eventMappingDAL.unMapEvents(eventsId);
    }

    async getEventsProviders(events_id: number[]): Promise<{ [key: string]: Provider[] }> {
        if (events_id === undefined || events_id.length == 0) return {};
        // get <event_id,provider_id> pair
        const result = await this.eventMappingDAL.getEventsProviders(events_id);
        // group providers by event ids
        const providersByEventIds = groupBy(result, 'event_id');
        // get providers
        const providers: Provider[] = await broker.sendRequest(CommunicationCodes.GET_ALL_PROVIDERS, {}, QueueType.COMMON_SERVICE);
        // return event with provider object
        const eventIds = Object.keys(providersByEventIds);
        // events with providers
        const eventsWithProvider: { [key: string]: Provider[] } = {};
        await map(eventIds, async event_id => {
            const eventProviders = providersByEventIds[event_id];
            eventsWithProvider[event_id] = providers.filter(provider => eventProviders.find(event => event.provider_id === provider.id));
            eventsWithProvider[event_id] = sortBy(eventsWithProvider[event_id], "order_id");
        })
        return eventsWithProvider;
    };
}