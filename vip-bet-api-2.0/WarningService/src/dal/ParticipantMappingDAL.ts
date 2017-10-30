/**
 * Created by   on 3/27/2017.
 */
import { IParticipantMappingDAL } from "./abstract/IParticipantMappingDAL";
import { ServiceBase } from "../../../CommonJS/src/bll/services/ServiceBase";

export class ParticipantMappingDAL implements IParticipantMappingDAL {
    async addWarning(providerId: number, providerParticipantId: string, providerParticipantName: string, providerSportId: string, providerSportName: string) {
        let query = `insert into participant_mapping(  provider_id, 
                                                    provider_participant_id, 
                                                    provider_participant_name, 
                                                    provider_sport_id,
                                                    provider_sport_name)  values ($1, $2, $3, $4, $5)
                      on conflict("provider_id", "provider_participant_id", "provider_sport_id") do update set provider_id=$1 RETURNING id;`;
        let data = await ServiceBase.db.one(query, [providerId.toString(), providerParticipantId, providerParticipantName, providerSportId, providerSportName]);
        return data.id;
    }

    async removeWarning(providerId: number, providerParticipantId: string, providerSportId: string) {
        let query = `delete from participant_mapping where provider_id = $1 and provider_participant_id = $2 and provider_sport_id = $3;`;
        return ServiceBase.db.none(query, [providerId.toString(), providerParticipantId, providerSportId]);
    }

    async getWarnings(page: number, limit: number) {
        let query = `select pm.*, count(pm.*) OVER() AS full_count, p.name as provider_name from participant_mapping as pm, provider p
                        where p.id = pm.provider_id
                        order by pm.provider_id, pm.provider_sport_id
                        limit $2
                        offset $1;`;
        return ServiceBase.db.manyOrNone(query, [page, limit]);
    }

    async getWarningsCount() {
        let query = `select count(*) from participant_mapping`;
        return ServiceBase.db.oneOrNone(query, []);
    }
}