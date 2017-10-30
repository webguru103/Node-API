import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { MessageHandlerBase } from "../../../CommonJS/src/messaging/MessageHandlerBase";
import { EventMarketService } from "../bll/services/EventMarketService";
import { EventSelectionService } from "../bll/services/EventSelectionService";

const eventMarketService = new EventMarketService();
const eventSelectionService = new EventSelectionService();

export class MessageHandler extends MessageHandlerBase {
    protected async handleMessage(message: any): Promise<any> {
        const body = message.body;
        switch (message.code) {
            case CommunicationCodes.ADD_EVENT_MARKET:
                return eventMarketService.addEventMarket(body.event_id, body.market_id);
            case CommunicationCodes.GET_EVENT_MARKET:
                return eventMarketService.getEventMarket(body.id, body.lang_id);
            case CommunicationCodes.GET_EVENT_MARKETS:
                return eventMarketService.getEventMarkets(body.event_id, body.lang_id, body.exclude_selections ? JSON.parse(body.exclude_selections) : false, body.is_tipster, body.scope_id, body.statistic_type_id);
            case CommunicationCodes.GET_EVENTS_WITH_MARKETS_ONLY:
                return eventMarketService.getEventsOnlyWithMarkets(body.events, body.is_tipster_default ? JSON.parse(body.is_tipster_default) : false);
            case CommunicationCodes.GET_EVENTS_MARKETS:
                return eventMarketService.getEventsMarkets(body.events_id, body.lang_id, body.exclude_selections, body.is_tipster_default);
            case CommunicationCodes.GET_EVENT_MARKETS_COUNT:
                return eventMarketService.getEventsMarketsCount(body.events_id);
            case CommunicationCodes.ADD_EVENT_SELECTION:
                return eventSelectionService.addEventSelection(body.eventMarketId, body.selectionId, body.argument, body.statusId);
            case CommunicationCodes.GET_EVENT_SELECTION:
                return eventSelectionService.getEventSelection(body.id, body.langId);
            case CommunicationCodes.GET_EVENT_MARKET_SELECTIONS:
                return eventSelectionService.getEventMarketSelections(body.event_market_id, body.lang_id);
            case CommunicationCodes.GET_BEST_ODDS_BY_EVENT_MARKET_ID:
                return eventMarketService.getBestOddsByEventMarketId(body.event_market_id, body.include_names ? JSON.parse(body.include_names) : true);
            case CommunicationCodes.GET_EVENT_MARKET_ODDS:
                return eventMarketService.getEventMarketOdds(body.event_market_id);
            case CommunicationCodes.GET_EVENT_SELECTIONS:
                return eventSelectionService.getEventSelections(body.event_selections);
            case CommunicationCodes.DELETE_EVENT_MARKETS:
                return eventMarketService.deleteEventMarketsByEventsId(body.events_id);
            case CommunicationCodes.DELETE_EVENT_MARKET_BY_MARKET_ID_CASCADE:
                return eventMarketService.eventMarketCascadeDeleteByMarketId(body.system_market_id, body.unmap != undefined ? body.unmap : true);
        }
    }
}