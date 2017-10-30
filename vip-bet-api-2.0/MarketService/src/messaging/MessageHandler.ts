/**
 * Created by   on 3/1/2017.
 */

import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { MessageHandlerBase } from "../../../CommonJS/src/messaging/MessageHandlerBase";
import { resolve, Thenable } from "bluebird";
import { DEFAULT_LANGUAGE } from "../../../CommonJS/src/domain/constant";
import { MarketService } from "../components/markets/services/market.service";
import { SelectionService } from "../components/selections/services/selection.service";

const marketService = new MarketService();
const selectionService = new SelectionService();

export class MessageHandler extends MessageHandlerBase {
    protected async handleMessage(message: any): Promise<any> {
        const body = message.body;
        switch (message.code) {
            case CommunicationCodes.ADD_MARKET:
                return marketService.add(body);
            case CommunicationCodes.GET_MARKET:
                return marketService.get(body);
            case CommunicationCodes.UPDATE_MARKET:
                return marketService.update(body);
            case CommunicationCodes.DELETE_MARKET:
                return marketService.delete(body);
            case CommunicationCodes.GET_MARKETS:
                return marketService.list(body);
            case CommunicationCodes.UPDATE_MARKETS:
                return marketService.updateMany(body);
            case CommunicationCodes.ADD_SELECTION:
                return selectionService.add(body);
            case CommunicationCodes.GET_SELECTION:
                return selectionService.get(body);
            case CommunicationCodes.GET_SELECTIONS:
                return selectionService.list(body);
        }
    }
}