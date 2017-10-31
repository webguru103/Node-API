import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { MessageHandlerBase } from "../../../CommonJS/src/messaging/MessageHandlerBase";
import { EventService } from "../components/events/services/event.service";
import { EventFilter } from "../components/events/filters/event.filter";
import { isString } from "lodash";

const eventService = new EventService();

export class MessageHandler extends MessageHandlerBase {
    protected async handleMessage(message: any): Promise<any> {
        const body = message.body;
        switch (message.code) {
            case CommunicationCodes.ADD_EVENT:
                return eventService.add(body);
            case CommunicationCodes.GET_EVENT:
                return eventService.get(body);
            case CommunicationCodes.GET_EVENTS:
                body.include_market_counts = isString(body.include_market_counts) ? JSON.parse(body.include_market_counts) : body.include_market_counts;
                if (body.include_market_counts === undefined) (body as EventFilter).include_market_counts = true;
                body.include_category_names = isString(body.include_category_names) ? JSON.parse(body.include_category_names) : body.include_category_names;
                if (body.include_category_names === undefined) (body as EventFilter).include_category_names = true;
                return eventService.list(body);
            case CommunicationCodes.GET_EVENTS_CATEGORIES_BY_TIME:
                return eventService.getEventCategoriesByTimeRange(body);
            case CommunicationCodes.GET_EVENTS_WITH_TIPSTER_DEFAULT_MARKET:
                return eventService.getEventsWithTipsterDefaultMarket(body);
            case CommunicationCodes.MOVE_EVENTS_TO_LEAGUE:
                return eventService.moveEventsToLeague(body.from, body.to, body.to_parent);
            case CommunicationCodes.DELETE_SPORT_EVENTS:
                return eventService.deleteSportEvents(body.id);
            case CommunicationCodes.DELETE_COUNTRY_EVENTS:
                return eventService.deleteCountryEvents(body.id);
            case CommunicationCodes.DELETE_LEAGUE_EVENTS:
                return eventService.deleteLeagueEvents(body.id);
            case CommunicationCodes.UPDATE_EVENTS_CATEGORY_STATUS:
                return eventService.updateCategoryStatus(body);
        }
    }
}