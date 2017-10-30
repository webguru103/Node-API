/**
 * Created by   on 3/27/2017.
 */
import { IMarketMappingService } from "../abstract/IMarketMappingService";
import { IMarketMappingDAL } from "../../dal/abstract/IMarketMappingDAL";
import { MarketMappingDAL } from "../../dal/MarketMappingDAL";
import { CommunicationCodes } from "../../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../../CommonJS/src/messaging/QueueType";
import { broker } from "../../../../CommonJS/src/bll/services/ServiceBase";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";

export class MarketMappingService implements IMarketMappingService {
    private marketMappingDAL: IMarketMappingDAL = new MarketMappingDAL();

    async addWarning(providerId: number, providerMarketId: string, providerMarketName: string, providerSportId: string) {
        let mapping = await broker.sendRequest(CommunicationCodes.GET_CATEGORY_MAPPING, {
            provider_id: providerId,
            provider_category_id: providerSportId,
            category_type: CategoryType.SPORT
        }, QueueType.MAPPING_SERVICE);
        if (!mapping) return;
        return this.marketMappingDAL.addWarning(providerId, providerMarketId, providerMarketName, providerSportId, mapping.provider_category_name);
    }

    async removeWarning(providerId: number, providerMarketId: number, providerSportId: string) {
        return this.marketMappingDAL.removeWarning(providerId, providerMarketId, providerSportId);
    }

    async getWarnings(page: number, limit: number) {
        return this.marketMappingDAL.getWarnings(page, limit);
    }

    async getWarningsCount() {
        return this.marketMappingDAL.getWarningsCount();
    }
}