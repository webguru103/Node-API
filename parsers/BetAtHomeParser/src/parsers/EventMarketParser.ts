/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventMarketService } from "../../../BaseParser/src/bll/abstract/IEventMarketService";
import { EventMarketService } from "../../../BaseParser/src/bll/services/EventMarketService";
import { map } from "bluebird";
import { isArray } from "lodash";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";
import { IBetAtHomeBet } from "../betAtHome";

export class EventMarketParser extends ParserBase {
    private eventMarketService: IEventMarketService = new EventMarketService();

    async processRequest(market: IBetAtHomeBet) {
        const sportId: string = market.SportId;
        const eventId: string = market.EventId;
        const marketType = market.$.DefaultName;
        const name: string = market.$.DefaultName;
        const id: string = market.$.Id;
        const status = EventStatus.ACTIVE;
        const argument1 = market.$.Param1;
        const argument2 = market.$.Param2;
        // add event market
        await this.eventMarketService.addEventMarket(id, name, status, eventId, marketType, sportId, marketType);
        // if selections empty
        if (!market.Odds || !isArray(market.Odds)) return;
        // if no selecion return;
        let selections = market.Odds[0].Odd;
        // check selections
        if (!selections || !isArray(selections)) return;
        // process event market selections
        return map(selections, async selection => {
            if (ParserBase.stopped) return;
            selection.EventMarketId = id;
            selection.SportId = sportId;
            selection.MarketType = marketType;
            selection.MarketTypeId = market.$.BetTypeId;
            selection.Participants = market.Participants;
            selection.Argument1 = argument1;
            selection.Argument2 = argument2;
            return this.successor.processRequest(selection).catch(err => {
                console.log("EventMarketOutcomeParser Error: ");
                console.log(err);
            });
        });
    }
}