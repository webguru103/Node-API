/**
 * Created by   on 3/4/2017.
 */
import { ISelectionMappingService } from "../abstract/ISelectionMappingService";
import { ISelectionMappingDAL } from "../../dal/abstract/ISelectionMappingDAL";
import { SelectionMappingDAL } from "../../dal/SelectionMappingDAL";
import { CommunicationCodes } from "../../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../../CommonJS/src/messaging/QueueType";
import { CategoryMappingService } from "./CategoryMappingService";
import { ICategoryMappingService } from "../abstract/ICategoryMappingService";
import { MarketMappingDAL } from "../../dal/MarketMappingDAL";
import { IMarketMappingDAL } from "../../dal/abstract/IMarketMappingDAL";
import { broker } from "../../../../CommonJS/src/base/base.model";
import { ISelectionMapping } from "../../components/selection/interfaces/selection.mapping.interface";
import { ISelectionModel } from "../../../../MarketService/src/components/selections/interfaces/selection.interface";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { defaultProvider } from "../../app";

export class SelectionMappingService implements ISelectionMappingService {
    private selectionMappingDAL: ISelectionMappingDAL = new SelectionMappingDAL();
    private categoryService: ICategoryMappingService = new CategoryMappingService();
    private marketMappingDAL: IMarketMappingDAL = new MarketMappingDAL()
    async addMapping(providerId: number, providerSelectionId: string, providerSelectionName: string,
        providerMarketId: string, providerCategoryId: string): Promise<number> {
        let mapId: number;
        //if already mapped return map id
        const alreadyMapped = await this.getMapping(providerId, providerSelectionId, providerMarketId, providerCategoryId, false);
        if (alreadyMapped) {
            mapId = alreadyMapped.id;
            if (alreadyMapped.system_selection_id) return mapId;
        } else {
            // add mapping row record
            mapId = await this.selectionMappingDAL.addMapping(providerId, providerSelectionId, providerSelectionName, providerMarketId, providerCategoryId);
        }
        //if current provider is not default
        if (defaultProvider.value != providerId) {
            // if (sameParticipant) await this.map(providerId, mapId, sameParticipant.system_participant_id);
            return mapId;
        };

        //if this is default provider than map automatically participant
        const categoryMap = await this.categoryService.getMapping(providerId, providerCategoryId, CategoryType.SPORT);
        // if sport is not mapped return
        if (!categoryMap || !categoryMap.system_category_id) return mapId;

        //sport mapped, now adding participant in case participant missing in system
        let selectionId: number;

        const market = await this.marketMappingDAL.getMapping(providerId, providerMarketId, providerCategoryId);
        if (!market) return mapId;

        if (alreadyMapped && alreadyMapped.system_selection_id) {
            selectionId = alreadyMapped.system_selection_id;
        } else {
            const selection: ISelectionModel = await broker.sendRequest(CommunicationCodes.ADD_SELECTION, {
                name: providerSelectionName,
                market_id: market.system_market_id,
                column_index: 1
            }, QueueType.MARKET_SERVICE);
            selectionId = selection.id;
        }
        const ids: any[] = [];
        ids.push(mapId);
        await this.map(providerId, mapId, selectionId);
        return mapId;
    }

    async map(providerId: number, mapId: number, systemSelectionId: number): Promise<any> {
        await this.unMap(mapId);
        const mapping = await this.selectionMappingDAL.map(mapId, systemSelectionId);
        //load all data from which was missing this mapping
        broker.publishMessageWithCode(CommunicationCodes.DELETE_SELECTION_WARNING, {
            providerId: providerId,
            providerSportId: mapping.provider_category_id,
            providerMarketId: mapping.provider_market_id,
            providerSelectionId: mapping.provider_selection_id
        }, QueueType.WARNINGS);
    }


    async getMapping(providerId: number, providerSelectionId: string, providerMarketId: string,
        providerSportId: string, sendWarning: boolean = true): Promise<ISelectionMapping> {
        const mapping = await this.selectionMappingDAL.getMapping(providerId, providerSelectionId, providerMarketId, providerSportId);
        if (sendWarning && mapping && !mapping.system_selection_id) {
            broker.publishMessageWithCode(CommunicationCodes.SELECTION_NOT_MAPPED, {
                providerId: providerId,
                providerSelectionId: providerSelectionId,
                providerSelectionName: providerSelectionId,
                providerMarketId: providerMarketId,
                providerSportId: providerSportId
            }, QueueType.WARNINGS);
        }
        return mapping;
    }

    async unMap(mapId: number): Promise<any> {
        return this.selectionMappingDAL.unMap(mapId);
    }

    async unMapSystemSelection(systemSelectionId: number): Promise<any> {
        return this.selectionMappingDAL.unMapSystemSelection(systemSelectionId);
    }

    async unMapMarketSelections(providerId: number, providerMarketId: number): Promise<any> {
        return this.selectionMappingDAL.unMapMarketSelections(providerId, providerMarketId);
    }

    async getMappingsByProviderIdAndMarketId(providerId: number, providerMarketId: number, systemCategoryId: string): Promise<any> {
        return this.selectionMappingDAL.getMappingsByProviderIdAndMarketId(providerId, providerMarketId, systemCategoryId);
    }
}