/**
 * Created by   on 3/4/2017.
 */
import { IEventSelectionMappingDAL } from "./abstract/IEventSelectionMappingDAL";
import { BaseModel } from "../../../CommonJS/src/base/base.model";
import { IEventSelectionMapping } from "../components/event_selection/interfaces/event_selection.mapping.interface";
import { groupBy } from "lodash";

export class EventSelectionMappingDAL implements IEventSelectionMappingDAL {
    async addMap(providerId: number, providerEventSelectionId: string, providerEventMarketId: string, providerSportId: string, providerMarketId: string, providerSelectionId: string, argument: string) {
        let query = `insert into event_selection_mapping (provider_id, provider_event_selection_id, provider_event_market_id, provider_sport_id, provider_market_id, provider_selection_id, argument)
                        values ($1, $2, $3, $4, $5, $6, $7)
                        on conflict ("provider_id", "provider_event_selection_id", "provider_event_market_id") do update set provider_event_selection_id=$2 RETURNING id;`;
        let data = await BaseModel.db.one(query, [providerId, providerEventSelectionId.toString(), providerEventMarketId.toString(), providerSportId, providerMarketId, providerSelectionId, argument || 0]);
        return data.id;
    }

    async map(mapId: number, systemEventSelectionId: number) {
        let query = `update event_selection_mapping 
                        set system_event_selection_id = $2
                        where id = $1;`;
        return BaseModel.none(query, [mapId, systemEventSelectionId]);
    }

    async getMapping(providerId: number, providerEventSelectionId: string, providerEventMarketId: string) {
        let query = `select id, system_event_selection_id from event_selection_mapping 
                        where provider_id = $1
                        and provider_event_selection_id = $2
                        and provider_event_market_id = $3;`;
        return BaseModel.oneOrNone(query, [providerId, providerEventSelectionId.toString(), providerEventMarketId.toString()]);
    }

    async getEventSelectionsByEventIdAndProviderId(providerId: number, eventId: string) {
        let query = `select esm.id, esm.system_event_selection_id from event_selection_mapping esm
                        join event_market_mapping emm on emm.provider_event_market_id = esm.provider_event_market_id and emm.provider_id = esm.provider_id
                        join event_mapping em on em.provider_event_id = emm.provider_event_id and em.provider_id = emm.provider_id
                        where em.provider_id = $1 
                        and em.system_event_id = $2
                        and esm.system_event_selection_id is not null;`;
        return BaseModel.manyOrNone(query, [providerId, eventId.toString()]);
    }

    async getEventSelectionsByEventId(providers: number[], eventId: string): Promise<{ [key: number]: IEventSelectionMapping[] }> {
        let query = `select esm.id, esm.system_event_selection_id, esm.provider_id
                        from event_selection_mapping esm
                        join event_market_mapping emm on emm.provider_event_market_id = esm.provider_event_market_id and emm.provider_id = esm.provider_id
                        join event_mapping em on em.provider_event_id = emm.provider_event_id and em.provider_id = emm.provider_id
                        where em.provider_id in ($1:csv) 
                        and em.system_event_id = $2
                        and esm.system_event_selection_id is not null;`;
        return BaseModel.manyOrNone(query, [providers, eventId.toString()]).then((data: any[]) => {
            return groupBy(data, "provider_id");
        });
    }

    async getEventSelectionsByProviderId(providerId: number, eventSelectionsIds: number[]): Promise<IEventSelectionMapping[]> {
        let query = `select esm.id, esm.system_event_selection_id from event_selection_mapping esm
                        where esm.provider_id = $1 and esm.system_event_selection_id in ($2:csv);`;
        return BaseModel.manyOrNone(query, [providerId, eventSelectionsIds]);
    }

    async getUnMappedEventSelections(providerId: number, providerSportId: string, providerMarketId: string, providerSelectionId: string): Promise<IEventSelectionMapping[]> {
        let query = `select * from event_selection_mapping 
                        where provider_id = $1
                        and provider_sport_id = $2
                        and provider_market_id = $3
                        and provider_selection_id = $4`;

        return BaseModel.manyOrNone(query, [providerId, providerSportId, providerMarketId, providerSelectionId]);
    }

    async getMapIdsByEventMarketId(eventMarketId: number) {
        let query = `select eventSelection.id, eventSelection.provider_id, eventSelection.system_event_selection_id
                        from 	event_selection_mapping as eventSelection, 
                                event_market_mapping as eventMarket  
                        where 	eventSelection.provider_event_market_id = eventMarket.provider_event_market_id
                        and		eventMarket.system_event_market_id = $1`;

        return BaseModel.manyOrNone(query, [eventMarketId]);
    }
}