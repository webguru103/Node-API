/**
 * Created by   on 3/1/2017.
 */

import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { MessageHandlerBase } from "../../../CommonJS/src/messaging/MessageHandlerBase";
import { ICategoryMappingService } from "../bll/abstract/ICategoryMappingService";
import { CategoryMappingService } from "../bll/services/CategoryMappingService";
import { IParticipantMappingService } from "../bll/abstract/IParticipantMappingService";
import { ParticipantMappingService } from "../bll/services/ParticipantMappingService";
import { IMarketMappingService } from "../bll/abstract/IMarketMappingService";
import { MarketMappingService } from "../bll/services/MarketMappingService";
import { SelectionMappingService } from "../bll/services/SelectionMappingService";
import { ISelectionMappingService } from "../bll/abstract/ISelectionMappingService";
import { ICommonMappingService } from "../bll/abstract/ICommonMappingService";
import { CommonMappingService } from "../bll/services/CommonMappingService";


let categoryMappingService: ICategoryMappingService = new CategoryMappingService();
let participantMappingService: IParticipantMappingService = new ParticipantMappingService();
let marketMappingService: IMarketMappingService = new MarketMappingService();
let selectionMappingService: ISelectionMappingService = new SelectionMappingService();
let commonMappingService: ICommonMappingService = new CommonMappingService();

export class MessageHandler extends MessageHandlerBase {
    protected async handleMessage(message: any): Promise<any> {
        const body = message.body;
        switch (message.code) {
            case CommunicationCodes.CATEGORY_NOT_MAPPED:
                return categoryMappingService.addWarning(body.provider_id, body.provider_category_id, body.provider_category_name, body.provider_parent_category_name, body.category_type);
            case CommunicationCodes.DELETE_CATEGORY_WARNING:
                return categoryMappingService.removeWarning(body.provider_id, body.provider_category_id, body.category_type);
            case CommunicationCodes.GET_CATEGORY_MAPPING_WARNINGS:
                return categoryMappingService.getWarnings(body.page, body.limit);

            case CommunicationCodes.PARTICIPANT_NOT_MAPPED:
                return participantMappingService.addWarning(body.providerId, body.providerParticipantId, body.providerParticipantName, body.providerSportId);
            case CommunicationCodes.DELETE_PARTICIPANT_WARNING:
                return participantMappingService.removeWarning(body.providerId, body.providerParticipantId, body.providerSportId);
            case CommunicationCodes.GET_PARTICIPANT_MAPPING_WARNINGS:
                return participantMappingService.getWarnings(body.page, body.limit);

            case CommunicationCodes.MARKET_NOT_MAPPED:
                return marketMappingService.addWarning(body.providerId, body.providerMarketId, body.providerMarketName, body.providerSportId);
            case CommunicationCodes.DELETE_MARKET_WARNING:
                return marketMappingService.removeWarning(body.providerId, body.providerMarketId, body.providerSportId);
            case CommunicationCodes.GET_MARKET_MAPPING_WARNINGS:
                return marketMappingService.getWarnings(body.page, body.limit);

            case CommunicationCodes.SELECTION_NOT_MAPPED:
                return selectionMappingService.addWarning(body.providerId, body.providerSelectionId, body.providerSelectionName, body.providerMarketId, body.providerSportId);
            case CommunicationCodes.DELETE_SELECTION_WARNING:
                return selectionMappingService.removeWarning(body.providerId, body.providerSelectionId, body.providerSportId, body.providerMarketId);
            case CommunicationCodes.GET_SELECTION_MAPPING_WARNINGS:
                return selectionMappingService.getWarnings(body.page, body.limit);


            case CommunicationCodes.GET_WARNINGS_COUNT:
                return commonMappingService.getWarningsCount();
        }
    }
}