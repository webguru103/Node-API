/**
 * Created by   on 3/5/2017.
 */
import { IEventService } from "../abstract/IEventService";
import { IEventDAL } from "../../dal/abstract/IEventDAL";
import { EventDAL } from "../../dal/EventDAL";
import { ServiceBase, broker } from "../../../../../CommonJS/src/bll/services/ServiceBase";
import { CommunicationCodes } from "../../../../../CommonJS/src/messaging/CommunicationCodes";
import { ErrorCodes, ErrorUtil } from "../../../../../CommonJS/src/messaging/ErrorCodes";
import { QueueType } from "../../../../../CommonJS/src/messaging/QueueType";
import { map } from "bluebird";
import { toNumber } from "lodash";
import { IFeedParticipant } from "../../interfaces/IFeedParticipant";
import { EventType } from "../../../../../EventService/src/components/events/enums/event_type.enum";
import { EventStatus } from "../../../../../EventService/src/components/events/enums/event_status.enum";
import { CategoryType } from "../../../../../CategoryService/src/components/category/enums/category_type.enum";
import { IParticipantMapping } from "../../../../../MappingService/src/components/participant/interfaces/participant.mapping.interface";
import { ICategoryMapping } from "../../../../../MappingService/src/components/category/interfaces/category.mapping.interface";
import { IParticipantLeague } from "../../../../../ParticipantService/src/components/participant_leagues/interfaces/participant_league.interface";

export class EventService extends ServiceBase implements IEventService {
    private eventDAL: IEventDAL = new EventDAL();

    async addEvent(id: string, eventName: string, type: EventType, startDate: Date, status: EventStatus,
        sportId: string, countryId: string, leagueId: string, participants: IFeedParticipant[]) {
        id = id.toString();
        sportId = sportId.toString();
        countryId = countryId.toString();
        leagueId = leagueId.toString();
        if (participants.length == 2) eventName = participants[0].name + " - " + participants[1].name;

        const participantIds = participants.map(p => { return p.id });
        await this.addParticipantMappings(participants, sportId, leagueId);

        await map(participantIds, async (participant) => {
            await this.addParticipantToLeague(participant.toString(), leagueId, countryId, sportId)
        });
        // set seconds to 0
        startDate.setSeconds(0, 0);
        // 
        let mapId = await broker.sendRequest(CommunicationCodes.MAP_EVENT, {
            start_date: startDate,
            provider_event_id: id,
            provider_sport_id: sportId,
            provider_country_id: countryId,
            provider_league_id: leagueId,
            provider_participant_ids: participantIds,
            provider_event_name: eventName,
            provider_id: ServiceBase.providerId,
            type: type
        }, QueueType.MAPPING_SERVICE);

        mapId = toNumber(mapId);
        if (mapId === 0) return;
        return this.eventDAL.addEvent(id, type, mapId, eventName, startDate, status, sportId, countryId, leagueId);
    }

    private async addParticipantMappings(participants: any[], sportId: string, leagueId: string) {
        if (participants.length < 2) {
            return;
        }

        return map(participants, async participant => {
            return broker.sendRequest(
                CommunicationCodes.ADD_PARTICIPANT_MAPPING, <IParticipantMapping>{
                    provider_sport_id: sportId,
                    provider_participant_id: participant.id,
                    provider_participant_name: participant.name,
                    provider_id: ServiceBase.providerId,
                    provider_league_id: leagueId
                },
                QueueType.MAPPING_SERVICE);
        });
    }

    private async addParticipantToLeague(participantId: string, leagueId: string, countryId: string, sportId: string) {
        let mapping = await broker.sendRequest(
            CommunicationCodes.GET_PARTICIPANT_MAPPING, <IParticipantMapping>{
                provider_id: ServiceBase.providerId,
                provider_participant_id: participantId,
                provider_sport_id: sportId
            },
            QueueType.MAPPING_SERVICE);

        if (!mapping || !mapping.system_participant_id) return ErrorUtil.newError(ErrorCodes.PARTICIPANT_NOT_MAPPED);

        let systemLeagueId = await this.getCategorySystemId(leagueId, CategoryType.LEAGUE)
        if (!systemLeagueId) return ErrorUtil.newError(ErrorCodes.LEAGUE_NOT_MAPPED);

        let systemCountryId = await this.getCategorySystemId(countryId, CategoryType.SPORT_COUNTRY)
        if (!systemCountryId) return ErrorUtil.newError(ErrorCodes.COUNTRY_NOT_MAPPED);

        return broker.sendRequest(
            CommunicationCodes.ADD_PARTICIPANT_TO_LEAGUE, <IParticipantLeague>{
                league_id: systemLeagueId,
                country_id: systemCountryId,
                participant_id: mapping.system_participant_id
            },
            QueueType.PARTICIPANT_SERVICE).then(ok => { }, err => {
                let errorMessage = err;
                if (errorMessage.includes(`insert or update on table "league_participant" violates foreign key constraint "league_participant_participant_id_foreign"`)) {
                    return broker.sendRequest(
                        CommunicationCodes.UPDATE_PARTICIPANT_MAPPING, <IParticipantMapping>{
                            id: mapping.id,
                            system_participant_id: null
                        }, QueueType.MAPPING_SERVICE).then(ok => {
                            throw new Error(errorMessage);
                        })
                } else {
                    throw new Error(errorMessage);
                }
            });
    }

    private async getCategorySystemId(providerCategoryId: string, categoryType: CategoryType) {
        let categoryMapping = await broker.sendRequest(
            CommunicationCodes.GET_CATEGORY_MAPPING, <ICategoryMapping>{
                provider_category_id: providerCategoryId.toString(),
                provider_id: ServiceBase.providerId,
                category_type: categoryType
            }, QueueType.MAPPING_SERVICE);
        return categoryMapping.system_category_id;
    }

    updateEvent(id: string, status: EventStatus) {
        return this.eventDAL.updateEvent(id, status);
    }

    getEvents(type: EventType, startDateFrom: Date, startDateTo: Date): Promise<any[]> {
        return this.eventDAL.getEvents(type, startDateFrom, startDateTo);
    }
}