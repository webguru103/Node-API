/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { parseMarket } from "../utils/market.util";
import { IEventMarketService } from "../../../BaseParser/src/bll/abstract/IEventMarketService";
import { EventMarketService } from "../../../BaseParser/src/bll/services/EventMarketService";
import { each } from "bluebird";
import { isArray, toString } from "lodash";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";
import { IMarket } from "../utils/ladbrokes";

export class EventMarketParser extends ParserBase {
    private eventMarketService: IEventMarketService = new EventMarketService();
    async processRequest(market: IMarket) {
        if (market.marketCollectionName == "Player Markets"
            || market.marketName.indexOf(" Goal Scorer") != -1
            || market.marketName.indexOf("Series Winner") != -1
            || market.marketName.indexOf("Price Boost") != -1
            || market.marketName.indexOf(" Goalscorer") != -1
            || market.marketName.indexOf("Player to Outscore") != -1
            || market.marketName.indexOf("Player to Score") != -1
            || market.marketName.indexOf("Match Specials") != -1
            || market.marketName.indexOf("Player To Score") != -1
            || market.marketName.indexOf("Scorer") != -1
            || market.marketName.indexOf("To Score a Hat-trick") != -1
            || market.marketName.indexOf(" - 1st Innings Runs") != -1
            || market.marketName.indexOf(" - 2nd Innings Runs") != -1
            || market.marketName.indexOf(" - 3rd Innings Runs") != -1
            || market.marketName.indexOf(" - 4th Innings Runs") != -1
            || market.marketName.indexOf(" - 5th Innings Runs") != -1
            || market.marketName.indexOf(" - 6th Innings Runs") != -1
            || market.marketName.indexOf(" - 7th Innings Runs") != -1
            || market.marketName.indexOf(" - 8th Innings Runs") != -1
            || market.marketName.indexOf(" - 9th Innings Runs") != -1
            || (market.marketName.indexOf("Score") != -1 && market.marketName.indexOf(" Goals or more") != -1)
            || market.marketName.indexOf(" - Runs") != -1
            || market.marketName.indexOf(" - Sixes") != -1
            || market.marketName.indexOf(" - Fours") != -1
            || market.marketName.indexOf(" - Wickets") != -1
            || market.marketName.indexOf(" innings runs") != -1
            || market.marketName.indexOf(" Runs in 1st ") != -1
            || market.marketName.indexOf(" Runs in 2nd ") != -1
            || market.marketName.indexOf(" Runs in 3rd ") != -1
            || market.marketName.indexOf(" Runs in 4th ") != -1
            || market.marketName.indexOf(" Runs in 5th ") != -1
            || market.marketName.indexOf(" Runs in 6th ") != -1
            || market.marketName.indexOf(" Runs in 7th ") != -1
            || market.marketName.indexOf(" Runs in 8th ") != -1
            || market.marketName.indexOf(" Runs in 9th ") != -1
            || market.marketName.indexOf(" Runs in Over ") != -1
            || market.marketName.indexOf(" Wicket ") != -1
            || market.marketName.indexOf("Total runs - ") != -1
            || market.marketName.indexOf("Specials") != -1
            || market.marketName.indexOf("Spread and Total Points Double") != -1
            || market.marketName.indexOf(" Runscorer") != -1) return;
        // parse market name and argument
        parseMarket(market);
        // add event market
        await this.eventMarketService.addEventMarket(toString(market.marketKey), market.marketName, EventStatus.ACTIVE, toString(market.eventKey), market.marketName, toString(market.classKey));
        // if selections missing return
        if (!market.selections || !market.selections.selection) return;
        // get selections
        const selections = isArray(market.selections.selection) ? market.selections.selection : [market.selections.selection];
        // process selections
        return each(selections, async selection => {
            if (ParserBase.stopped) return;
            selection.participants = market.participants;
            selection.classKey = market.classKey;
            selection.marketName = market.marketName;
            selection.argument = market.handicapValue;
            selection.isHandicapMarket = market.isHandicapMarket;
            selection.marketMeaningMinorCode = market.marketMeaningMinorCode;
            selection.marketMeaningMajorCode = market.marketMeaningMajorCode;
            return this.successor.processRequest(selection).catch(err => {
                console.log("EventMarketOutcomeParser Error: " + err);
            });
        });
    }
}