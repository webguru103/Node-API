/**
 * Created by   on 3/4/2017.
 */
import { IMarketMappingService } from "../abstract/IMarketMappingService";
import { IMarketMappingDAL } from "../../dal/abstract/IMarketMappingDAL";
import { MarketMappingDAL } from "../../dal/MarketMappingDAL";
import { SelectionMappingService } from "./SelectionMappingService";
import { ISelectionMappingService } from "../abstract/ISelectionMappingService";
import { ErrorCodes, ErrorUtil } from "../../../../CommonJS/src/messaging/ErrorCodes";
import { QueueType } from "../../../../CommonJS/src/messaging/QueueType";
import { CommunicationCodes } from "../../../../CommonJS/src/messaging/CommunicationCodes";
import { all, map } from "bluebird";
import { ICategoryMappingService } from "../abstract/ICategoryMappingService";
import { CategoryMappingService } from "./CategoryMappingService";
import { broker } from "../../../../CommonJS/src/base/base.model";
import { IMarketPublic } from "../../../../MarketService/src/components/markets/interfaces/market.interface";
import { IMarketMapping } from "../../components/market/interfaces/market.mapping.interface";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { defaultProvider } from "../../app";

export class MarketMappingService implements IMarketMappingService {
    private marketMappingDAL: IMarketMappingDAL = new MarketMappingDAL();
    private selectionMappingService: ISelectionMappingService = new SelectionMappingService();
    private categoryService: ICategoryMappingService = new CategoryMappingService();

    async addMarketMapping(providerId: number, providerMarketId: string, providerSportId: string, providerMarketName: string): Promise<number> {
        //get default provider
        // const defaultProvider = await broker.sendRequest(CommunicationCodes.GET_DEFAULT_PROVIDER, {}, QueueType.COMMON_SERVICE);
        // 
        let mapId: number;
        //if already mapped return map id
        const alreadyMapped = await this.getMapping(providerId, providerMarketId, providerSportId, false);
        if (alreadyMapped) {
            mapId = alreadyMapped.id;
            if (alreadyMapped.system_market_id) return mapId;
        } else {
            //add mapping row record
            mapId = await this.marketMappingDAL.addMarketMapping(providerId, providerMarketId, providerSportId, providerMarketName);
        }
        //if current provider is not default
        if (defaultProvider.value != providerId) {
            // if (sameParticipant) await this.map(providerId, mapId, sameParticipant.system_participant_id);
            return mapId;
        };

        //if this is default provider than map automatically participant
        const categoryMap = await this.categoryService.getMapping(providerId, providerSportId, CategoryType.SPORT);
        //if sport is not mapped return
        if (!categoryMap || !categoryMap.system_category_id) return mapId;

        //sport mapped, now adding participant in case participant missing in system
        let marketId: number;
        if (alreadyMapped && alreadyMapped.system_market_id) {
            marketId = alreadyMapped.system_market_id;
        } else {
            const market = <IMarketPublic>await broker.sendRequest(CommunicationCodes.ADD_MARKET, {
                category_id: categoryMap.system_category_id,
                name: providerMarketName
            }, QueueType.MARKET_SERVICE);
            // set id
            marketId = market.id;
        }

        let ids: any[] = [];
        ids.push(mapId);
        //mapping already added participant with provider participant
        await this.mapMarket(providerId, ids, marketId, false);
        return mapId;
    }

    async mapMarket(providerId: number, mapsId: number[], systemMarketId: number, unmap: boolean = true): Promise<IMarketMapping[]> {
        if (unmap) await this.unMapMarket(providerId, systemMarketId);
        return map(mapsId, async (mapId) => {
            const mapping = await this.marketMappingDAL.mapMarket(mapId, systemMarketId);
            //load all data from which was missing this mapping
            broker.publishMessageWithCode(CommunicationCodes.DELETE_MARKET_WARNING, {
                providerId: providerId,
                providerSportId: mapping.provider_category_id,
                providerMarketId: mapping.provider_market_id
            }, QueueType.WARNINGS);
            return mapping;
        })
    }

    async mapMarketWithSelections(providerId: number, systemMarketId: number, marketMappings: any[], selectionMappings: any[]): Promise<any> {
        if (!providerId) throw ErrorUtil.newError(ErrorCodes.PROVIDER_ID_IS_MISSING);
        if (!systemMarketId) throw ErrorUtil.newError(ErrorCodes.MARKET_ID_IS_MISSING);

        await this.mapMarket(providerId, marketMappings, systemMarketId);
        if (selectionMappings && marketMappings.length > 0) {
            return map(selectionMappings, selectionMapping => {
                if (!selectionMapping.mapId) throw ErrorUtil.newError(ErrorCodes.SELECTION_MAP_ID_IS_MISSING);
                if (!selectionMapping.systemSelectionId) throw ErrorUtil.newError(ErrorCodes.SELECTION_SYSTEM_ID_IS_MISSING);
                return this.selectionMappingService.map(providerId, selectionMapping.mapId, selectionMapping.systemSelectionId);
            });
        }
    }

    async unMapMarket(providerId: number, systemMarketId: number): Promise<any> {
        let markets: any[] = await this.getMarketMappingsByProviderId(systemMarketId, providerId);
        let queries: any[] = [];
        await map(markets, market => {
            queries.push(this.selectionMappingService.unMapMarketSelections(providerId, market.provider_market_id));
            queries.push(this.marketMappingDAL.unMapMarket(providerId, systemMarketId));
        });
        return all(queries);
    }

    async getMapping(providerId: number, providerMarketId: string, providerSportId: string, sendWarning: boolean = true): Promise<IMarketMapping> {
        const mapping = await this.marketMappingDAL.getMapping(providerId, providerMarketId, providerSportId);
        if (sendWarning && mapping && !mapping.system_market_id) {
            broker.publishMessageWithCode(CommunicationCodes.MARKET_NOT_MAPPED, {
                providerId: providerId,
                providerMarketId: providerMarketId,
                providerMarketName: providerMarketId,
                providerSportId: providerSportId
            }, QueueType.WARNINGS);
        }
        return mapping;
    }

    async getMarketMappingsByProviderId(systemMarketId: number, providerId: number): Promise<any[]> {
        return this.marketMappingDAL.getMarketMappingsByProviderId(systemMarketId, providerId);
    }

    async getUnmappedMarketsByProviderIdAndSportId(providerId: number, sportId: number): Promise<any> {
        return this.marketMappingDAL.getUnmappedMarketsByProviderIdAndSportId(providerId, sportId);
    }
}