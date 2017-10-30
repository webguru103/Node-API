/**
 * Created by   on 3/27/2017.
 */
import { IMarketMappingDAL } from "./abstract/IMarketMappingDAL";
import { ServiceBase } from "../../../CommonJS/src/bll/services/ServiceBase";

export class MarketMappingDAL implements IMarketMappingDAL {
    async addWarning(providerId: number, providerMarketId: string, providerMarketName: string, providerSportId: string, providerSportName: string) {
        let query = `insert into market_mapping(  provider_id, 
                                                    provider_market_id, 
                                                    provider_market_name, 
                                                    provider_sport_id,
                                                    provider_sport_name)  values ($1, $2, $3, $4, $5)
                      on conflict("provider_id", "provider_market_id", "provider_sport_id") do update set provider_id=$1 RETURNING id;`;
        let data = await ServiceBase.db.one(query, [providerId.toString(), providerMarketId, providerMarketName, providerSportId, providerSportName]);
        return data.id;
    }

    async removeWarning(providerId: number, providerMarketId: number, providerSportId: string) {
        let query = `delete from market_mapping where provider_id = $1 and provider_market_id = $2 and provider_sport_id = $3;`;
        return ServiceBase.db.none(query, [providerId.toString(), providerMarketId, providerSportId]);
    }

    async getWarnings(page: number, limit: number) {
        let query = `select mm.*, count(mm.*) OVER() AS full_count, p.name as provider_name from market_mapping as mm, provider p
                        where p.id = mm.provider_id
                        order by mm.provider_id, mm.provider_sport_id, mm.provider_market_name
                        limit $2
                        offset $1;`;
        return ServiceBase.db.manyOrNone(query, [page, limit]);
    }

    async getWarningsCount() {
        let query = `select count(*) from market_mapping`;
        return ServiceBase.db.oneOrNone(query, []);
    }
}