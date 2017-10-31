/**
 * Created by   on 3/4/2017.
 */
import { ISelectionMappingDAL } from "./abstract/ISelectionMappingDAL";
import { BaseModel } from "../../../CommonJS/src/base/base.model";
import { ISelectionMapping } from "../components/selection/interfaces/selection.mapping.interface";

export class SelectionMappingDAL implements ISelectionMappingDAL {
    async addMapping(providerId: number, providerSelectionId: string, providerSelectionName: string,
        providerMarketId: string, providerCategoryId: string): Promise<number> {
        let query = `insert into selection_mapping (provider_id, provider_selection_id, provider_selection_name, provider_market_id, provider_category_id) 
                        values ($1, $2, $3, $4, $5)
                        on conflict(provider_id, provider_selection_id, provider_market_id, provider_category_id) do update set provider_selection_id = $2 returning id`;
        let map = await BaseModel.oneOrNone(query, [providerId, providerSelectionId.toString(), providerSelectionName, providerMarketId.toString(), providerCategoryId.toString()]);
        return map.id;
    }

    async map(mapId: number, systemSelectionId: number): Promise<ISelectionMapping> {
        let query = `update selection_mapping 
                        set system_selection_id = $2
                        where id = $1
                        returning *;`;
        return BaseModel.oneOrNone(query, [mapId, systemSelectionId]);
    }

    async getProviderSelectionId(mapId: number): Promise<ISelectionMapping> {
        let query = `select * from selection_mapping 
                        where id = $1;`;
        return BaseModel.oneOrNone(query, [mapId]);
    }

    async getMapping(providerId: number, providerSelectionId: string, providerMarketId: string,
        providerCategoryId: string): Promise<ISelectionMapping> {
        let query = `select id, system_selection_id from selection_mapping 
                        where provider_id = $1
                        and provider_selection_id = $2
                        and provider_market_id = $3
                        and provider_category_id = $4`;
        return BaseModel.oneOrNone(query, [providerId, providerSelectionId, providerMarketId, providerCategoryId]);
    }

    async unMap(mapId: number) {
        let query = `update selection_mapping 
                        set system_selection_id = null
                        where id = $1`;
        return BaseModel.none(query, [mapId]);
    }

    async unMapSystemSelection(systemSelectionId: number) {
        let query = `update selection_mapping 
                        set system_selection_id = null
                        where system_selection_id = $1`;
        return BaseModel.none(query, [systemSelectionId]);
    }

    async unMapMarketSelections(providerId: number, providerMarketId: number) {
        let query = `update selection_mapping 
                        set system_selection_id = null
                        where provider_id = $1
                        and provider_market_id = $2`;
        return BaseModel.none(query, [providerId, providerMarketId]);
    }

    async getMappingsByProviderIdAndMarketId(providerId: number, providerMarketId: number, systemCategoryId: string): Promise<ISelectionMapping[]> {
        let query = `select sm.* from selection_mapping sm
                        join category_mapping cm on cm.provider_id = sm.provider_id and sm.provider_category_id = cm.provider_category_id
                        where sm.provider_id = $1
                        and sm.provider_market_id = $2
                        and cm.system_category_id = $3;`;
        return BaseModel.manyOrNone(query, [providerId, providerMarketId, systemCategoryId]);
    }
}