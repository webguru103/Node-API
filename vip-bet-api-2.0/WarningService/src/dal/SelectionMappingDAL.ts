/**
 * Created by   on 3/27/2017.
 */
import { ISelectionMappingDAL } from "./abstract/ISelectionMappingDAL";
import { ServiceBase } from "../../../CommonJS/src/bll/services/ServiceBase";

export class SelectionMappingDAL implements ISelectionMappingDAL {
    async addWarning(providerId: number, providerSelectionId: string, providerSelectionName: string,
        providerMarketId: string, providerMarketName: string, providerSportId: string, providerSportName: string) {
        let query = `insert into selection_mapping(  provider_id, 
                                                    provider_selection_id, 
                                                    provider_selection_name, 
                                                    provider_market_id, 
                                                    provider_market_name,
                                                    provider_sport_id,
                                                    provider_sport_name)  values ($1, $2, $3, $4, $5, $6, $7)
                      on conflict("provider_id", "provider_selection_id", "provider_market_id", "provider_sport_id") do update set provider_id=$1 RETURNING id;`;
        let data = await ServiceBase.db.one(query, [providerId.toString(), providerSelectionId, providerSelectionName, providerMarketId, providerMarketName, providerSportId, providerSportName]);
        return data.id;
    }

    async removeWarning(providerId: number, providerSelectionId: string, providerSportId: string, providerMarketId: string) {
        let query = `delete from selection_mapping where provider_id = $1 and provider_selection_id = $2 and provider_sport_id = $3 and provider_market_id = $4;`;
        return ServiceBase.db.none(query, [providerId.toString(), providerSelectionId, providerSportId, providerMarketId]);
    }

    async getWarnings(page: number, limit: number) {
        let query = `select sm.*, count(sm.*) OVER() AS full_count, p.name as provider_name from selection_mapping as sm, provider p
                        where p.id = sm.provider_id
                        order by sm.provider_id, sm.provider_sport_id, sm.provider_market_id, sm.provider_selection_name
                        limit $2
                        offset $1;`;
        return ServiceBase.db.manyOrNone(query, [page, limit]);
    }

    async getWarningsCount() {
        let query = `select count(*) from selection_mapping`;
        return ServiceBase.db.oneOrNone(query, []);
    }
}