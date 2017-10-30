/**
 * Created by   on 3/4/2017.
 */
import { IMarketMappingDAL } from "./abstract/IMarketMappingDAL";
import { BaseModel } from "../../../CommonJS/src/base/base.model";
import { IMarketMapping } from "../components/market/interfaces/market.mapping.interface";

export class MarketMappingDAL implements IMarketMappingDAL {
    async addMarketMapping(providerId: number, providerMarketId: string, providerSportId: string, providerMarketName: string): Promise<number> {
        let query = `insert into market_mapping (provider_id, provider_market_id, provider_market_name, provider_category_id) values ($1, $2, $3, $4) 
                        on conflict(provider_id, provider_market_id, provider_category_id) do update set provider_market_id = $2 returning id;`;
        let map = await BaseModel.oneOrNone(query, [providerId.toString(), providerMarketId.toString(), providerMarketName, providerSportId.toString()]);
        return map.id;
    }

    async mapMarket(mapId: number, systemMarketId: number): Promise<IMarketMapping> {
        let query = `update market_mapping 
                        set system_market_id = $2
                        where id = $1
                        returning *;`;
        return BaseModel.oneOrNone(query, [mapId, systemMarketId])
    }

    async unMapMarket(providerId: number, systemMarketId: number): Promise<any> {
        let query = `update market_mapping 
                        set system_market_id = null
                        where provider_id = $1
                        and system_market_id = $2`;
        return BaseModel.none(query, [providerId.toString(), systemMarketId])
    }

    async getMapping(providerId: number, providerMarketId: string, providerSportId: string): Promise<any> {
        let query = `select * from market_mapping 
                        where provider_id = $1
                        and provider_market_id = $2
                        and provider_category_id = $3`;
        return BaseModel.oneOrNone(query, [providerId.toString(), providerMarketId.toString(), providerSportId.toString()]);
    }

    async getProviderMarketId(mapId: number): Promise<any> {
        let query = `select provider_market_id, provider_category_id from market_mapping 
                        where id = $1`;
        return BaseModel.oneOrNone(query, [mapId]);
    }

    async getMappedMarket(providerId: number, providerMarketId: string): Promise<any> {
        let query = `select * from market_mapping 
                        where provider_id = $1
                        and provider_market_id = $2`;
        return BaseModel.db.one(query, [providerId.toString(), providerMarketId.toString()])
    }

    async getMarketMappingsByProviderId(systemMarketId: number, providerId: number): Promise<any[]> {
        let query = `select * from market_mapping 
                        where system_market_id = $1
                        and provider_id = $2`;
        return BaseModel.manyOrNone(query, [systemMarketId, providerId.toString()])
    }

    async getUnmappedMarketsByProviderIdAndSportId(providerId: number, sportId: number): Promise<any[]> {
        let query = `select distinct market_mapping.id, 
                            market_mapping.provider_market_name,
                            market_mapping.provider_market_id,
                            market_mapping.provider_id
                        from market_mapping
                        join category_mapping on category_mapping.provider_category_id = market_mapping.provider_category_id and category_mapping.provider_id = market_mapping.provider_id 
                        where market_mapping.provider_id = $1
                        and category_mapping.system_category_id = $2
                        and market_mapping.system_market_id is null`;
        return BaseModel.manyOrNone(query, [providerId.toString(), sportId]);
    }

    async getMappedProviders(systemMarketId: number) {
        let query = `select provider_id from market_mapping 
                        where system_market_id = $1;`;
        return BaseModel.manyOrNone(query, [systemMarketId]);
    }
}