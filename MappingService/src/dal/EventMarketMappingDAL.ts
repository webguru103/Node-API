/**
 * Created by   on 3/4/2017.
 */
import { IEventMarketMappingDAL } from "./abstract/IEventMarketMappingDAL";
import { BaseModel } from "../../../CommonJS/src/base/base.model";
import { IEventMarketMapping } from "../components/event_market/interfaces/event_market.mapping.interface";

export class EventMarketMappingDAL implements IEventMarketMappingDAL {
    async addMap(providerId: number, providerEventMarketId: string, providerMarketId: string, providerEventId: string, providerSportId: string) {
        let query = `insert into event_market_mapping (provider_id, provider_event_market_id, provider_market_id, provider_event_id, provider_sport_id) values ($1, $2, $3, $4, $5)
                        on conflict ("provider_id", "provider_event_market_id") do update set provider_id=$1 RETURNING id;`;
        let data = await BaseModel.db.one(query, [providerId, providerEventMarketId.toString(), providerMarketId.toString(), providerEventId.toString(), providerSportId]);
        return data.id;
    }

    async map(mapId: number, systemEventMarketId: number): Promise<IEventMarketMapping> {
        let query = `update event_market_mapping 
                        set system_event_market_id = $2
                        where id = $1;`;
        return BaseModel.oneOrNone(query, [mapId, systemEventMarketId]);
    }

    async getMapping(providerId: number, providerEventMarketId: string) {
        let query = `select * from event_market_mapping 
                        where provider_id = $1
                        and provider_event_market_id = $2;`;
        return BaseModel.oneOrNone(query, [providerId, providerEventMarketId.toString()]);
    }

    async getMappings(systemEventMarketId: number) {
        let query = `select * from event_market_mapping 
                        where system_event_market_id = $1`;
        return BaseModel.manyOrNone(query, [systemEventMarketId]);
    }

    async getUnMappedEventMarkets(providerId: number, providerSportId: string, providerMarketId: string) {
        let query = `select * from event_market_mapping 
                        where provider_id = $1
                        and provider_sport_id = $2
                        and provider_market_id = $3
                        and system_event_market_id is null`;

        return BaseModel.manyOrNone(query, [providerId, providerSportId, providerMarketId]);
    }

    async unMapEventMarketsWithEventSelectionsByMarketId(marketId: number, unmapTemplete: boolean): Promise<any> {
        let query = `
                    with event_selections_maps_id as (select esm.id from event_selection_mapping esm
                        join event_market_mapping emm   on  esm.provider_id = emm.provider_id 
                                                        and esm.provider_market_id = emm.provider_market_id
                                                        and esm.provider_sport_id = emm.provider_sport_id
                        join market_mapping mm          on  emm.provider_id = mm.provider_id
                                                        and emm.provider_market_id = mm.provider_market_id
                                                        and emm.provider_sport_id = mm.provider_category_id
                        where mm.system_market_id = ${marketId})
                    update event_selection_mapping set system_event_selection_id = null where id in (select id from event_selections_maps_id);

                    with event_markets_maps_id as (select emm.id from event_market_mapping emm
                        join market_mapping mm          on  emm.provider_id = mm.provider_id
                                                        and emm.provider_market_id = mm.provider_market_id
                                                        and emm.provider_sport_id = mm.provider_category_id
                        where mm.system_market_id = ${marketId})
                    update event_market_mapping set system_event_market_id = null where id in (select id from event_markets_maps_id);`;
        if (unmapTemplete) {
            query += ` update market_mapping set system_market_id = null where system_market_id = ${marketId};`
        };
        return BaseModel.none(query);
    }
}