/**
 * Created by   on 3/27/2017.
 */
import { ISelectionMappingService } from "../abstract/ISelectionMappingService";
import { ISelectionMappingDAL } from "../../dal/abstract/ISelectionMappingDAL";
import { SelectionMappingDAL } from "../../dal/SelectionMappingDAL";
import { CommunicationCodes } from "../../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../../CommonJS/src/messaging/QueueType";
import { broker } from "../../../../CommonJS/src/bll/services/ServiceBase";

export class SelectionMappingService implements ISelectionMappingService {
    private selectionMappingDAL: ISelectionMappingDAL = new SelectionMappingDAL();

    async addWarning(providerId: number, providerSelectionId: string, providerSelectionName: string, providerMarketId: string, providerSportId: string) {
        let sportMapping = await broker.sendRequest(CommunicationCodes.GET_CATEGORY_MAPPING, {
            provider_id: providerId,
            provider_category_id: providerSportId
        }, QueueType.MAPPING_SERVICE);
        if (!sportMapping) return;

        let marketMapping = await broker.sendRequest(CommunicationCodes.GET_MARKET_MAPPING, {
            providerId: providerId,
            providerMarketId: providerMarketId,
            providerSportId: providerSportId
        }, QueueType.MAPPING_SERVICE);
        if (!marketMapping) return;

        return this.selectionMappingDAL.addWarning(
            providerId, providerSelectionId, providerSelectionName, providerMarketId,
            marketMapping.provider_market_name, providerSportId, sportMapping.provider_category_name);
    }

    async removeWarning(providerId: number, providerSelectionId: string, providerSportId: string, providerMarketId: string) {
        return this.selectionMappingDAL.removeWarning(providerId, providerSelectionId, providerSportId, providerMarketId);
    }

    async getWarnings(page: number, limit: number) {
        return this.selectionMappingDAL.getWarnings(page, limit);
    }

    async getWarningsCount() {
        return this.selectionMappingDAL.getWarningsCount();
    }
}