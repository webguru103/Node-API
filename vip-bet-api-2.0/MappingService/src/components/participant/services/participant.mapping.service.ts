/**
 * Created by   on 3/14/2017.
 */

import { isString } from "lodash";
import { map } from "bluebird";
import { ICategoryMappingService } from "../../../bll/abstract/ICategoryMappingService";
import { CategoryMappingService } from "../../../bll/services/CategoryMappingService";
import { IParticipantMapping } from "../interfaces/participant.mapping.interface";
import { isNotNumber } from "../../../../../CommonJS/src/utils/validators";
import { ErrorUtil } from "../../../../../CommonJS/src/messaging/ErrorCodes";
import { defaultProvider } from "../../../app";
import { IParticipant } from "../../../../../ParticipantService/src/components/participants/interfaces/participant.interface";
import { CategoryType } from "../../../../../CategoryService/src/components/category/enums/category_type.enum";
import { broker, QueryBuilder, BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { CommunicationCodes } from "../../../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../../../CommonJS/src/messaging/QueueType";
import { ParticipantMapping } from "../models/participant.mapping.model";
import { ParticipantMappingFilter } from "../filters/participant.mapping.filter";
import { ProviderParticipantFilter } from "../filters/provider.participant.filter";

export class ParticipantMappingService {
    private categoryService: ICategoryMappingService = new CategoryMappingService();

    async add(map: IParticipantMapping): Promise<IParticipantMapping | undefined> {
        if (isNotNumber(map.provider_id)
            || !isString(map.provider_participant_id)
            || !isString(map.provider_sport_id)) throw ErrorUtil.newError("invalid mapping");
        //if already mapped return map id
        const [alreadyMapped] = await this.list({
            provider_id: map.provider_id,
            provider_participant_id: map.provider_participant_id,
            provider_sport_id: map.provider_sport_id
        });
        // if already mapped check does such participant exists if yes set map_id
        if (alreadyMapped && alreadyMapped.system_participant_id) return alreadyMapped;
        // map participant if other providers has mapping for participant in same sport and with same participant name
        // if current provider is not default
        if (defaultProvider.value !== map.provider_id) return;
        // if this is default provider than map automatically participant
        // get category mapping to be sure that category mapped
        const categoryMap = await this.categoryService.getMapping(map.provider_id, map.provider_sport_id, CategoryType.SPORT);
        // if sport is not mapped return
        if (!categoryMap || isNotNumber(categoryMap.system_category_id)) return;
        // sport mapped, now adding participant in case participant missing in system
        const participant: IParticipant = await broker.sendRequest(CommunicationCodes.ADD_PARTICIPANT, {
            sport_id: categoryMap.system_category_id,
            name: map.provider_participant_name
        }, QueueType.PARTICIPANT_SERVICE);
        // set system participant id
        map.system_participant_id = participant.id;
        // mapping already added participant with provider participant
        return map.saveWithID(`on conflict (provider_id, provider_participant_id, provider_sport_id) do update set provider_participant_id = '${map.provider_participant_id}', provider_league_id = '${map.provider_league_id}'`);
    }

    async update(map: IParticipantMapping): Promise<IParticipantMapping | undefined> {
        if (isNotNumber(map.id)) throw ErrorUtil.newError("invalid mapping");
        // get mapping
        const [mapping] = await this.list({ id: map.id });
        // if not found return exception
        if (!mapping) throw ErrorUtil.newError("mapping not found");
        // update mapping
        await mapping.update(map);
        // if mapped delete warning
        if (mapping.system_participant_id)
            broker.publishMessageWithCode(CommunicationCodes.DELETE_PARTICIPANT_WARNING, {
                providerId: mapping.provider_id,
                providerParticipantId: mapping.provider_participant_id,
                providerSportId: mapping.provider_sport_id
            }, QueueType.WARNINGS);
        // return mapping
        return mapping
    }

    async mapParticipant(systemParticipantId: number, maps: IParticipantMapping[]): Promise<(IParticipantMapping | undefined)[]> {
        if (isNotNumber(systemParticipantId)) throw ErrorUtil.newError("invalid mapping");
        if (!maps || maps.find(m => isNotNumber(m.id))) throw ErrorUtil.newError("invalid mapping");
        // unmap all for this provider_id and system_participant
        const query = QueryBuilder(ParticipantMapping.tableName)
            .update({ system_participant_id: null })
            .where({ system_participant_id: systemParticipantId });
        await BaseModel.none(query.toString())
        // update
        return map(maps, async m => this.update(<IParticipantMapping>{ id: m.id, system_participant_id: systemParticipantId }));
    }

    async get(filter: Partial<ParticipantMappingFilter>): Promise<IParticipantMapping | undefined> {
        filter = new ParticipantMappingFilter(filter);
        if (Object.keys(filter).length == 0) throw ErrorUtil.newError("invalid get request");
        // get participant mapping with provider_participant_id
        const [mapping] = await this.list(filter);
        if (!mapping) return;
        // if provider participant is not mapped add warning
        if (mapping && !mapping.system_participant_id) {
            broker.publishMessageWithCode(CommunicationCodes.PARTICIPANT_NOT_MAPPED, {
                providerId: filter.provider_id,
                providerParticipantId: filter.provider_participant_id,
                providerParticipantName: filter.provider_participant_name,
                providerSportId: filter.provider_sport_id
            }, QueueType.WARNINGS);
        }
        // return mapping;
        return mapping;
    }

    async list(filter: Partial<ParticipantMappingFilter>): Promise<IParticipantMapping[]> {
        return new ParticipantMappingFilter(filter).find();
    }

    async getProviderParticipantsBySportId(filter: ProviderParticipantFilter): Promise<IParticipantMapping[]> {
        return new ProviderParticipantFilter(filter).find();
    }

    async updateParticipantMappings(providerSportId?: string, providerParticipantName?: string): Promise<any> {
        let query = `   with parts as (
                            select  distinct part_map.id, 
                                        part_map_2.system_participant_id 
                                        from participant_mapping as part_map
                                            join participant_mapping as part_map_2 on LOWER(trim(part_map.provider_participant_name)) = LOWER(trim(part_map_2.provider_participant_name))
                                            join category_mapping as cat_map on cat_map.provider_category_id = part_map_2.provider_sport_id
                                            join category_mapping as cat_map_2 on cat_map_2.provider_category_id = part_map.provider_sport_id
                                            where part_map.provider_id <> part_map_2.provider_id
                                            and part_map.system_participant_id is null
                                            and part_map_2.system_participant_id is not null`;
        if (providerSportId && providerParticipantName) {
            query += ` and part_map.provider_participant_name = '${providerParticipantName}'
                       and part_map.provider_sport_id = '${providerSportId}'`
        }
        query += `  and cat_map.system_category_id = cat_map_2.system_category_id)
                    update participant_mapping
                    set system_participant_id = parts.system_participant_id
                    from parts
                    where participant_mapping.id = parts.id;`;
        return BaseModel.none(query);
    }
}