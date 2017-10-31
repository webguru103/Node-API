/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventMarketService } from "../../../BaseParser/src/bll/abstract/IEventMarketService";
import { EventMarketService } from "../../../BaseParser/src/bll/services/EventMarketService";
import { each } from "bluebird";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";
import { IMarket } from "../intertops";
import { isArray } from "lodash";

export class EventMarketParser extends ParserBase {
    private eventMarketService: IEventMarketService = new EventMarketService();

    async processRequest(market: IMarket) {
        // dont parse live markets
        const sportId = market.sportId;
        const eventId = market.eventId;
        let name = market.$.n;
        // if all outcomes closed
        const status = EventStatus.ACTIVE;
        // replace argument in name
        market.l.map(selection => {
            name = name.replace(selection.$.p, "").trim();
        })
        const id = eventId + "/" + name;
        // add event market
        await this.eventMarketService.addEventMarket(id, name, status, eventId, name, sportId, name);
        if (!isArray(market.l)) return;
        return each(market.l, async selection => {
            if (ParserBase.stopped) return;
            selection.eventMarketId = id;
            selection.sportId = sportId;
            selection.marketName = name;
            selection.marketId = name;
            selection.participants = market.participants;
            return this.successor.processRequest(selection).catch(err => {
                console.log("EventMarketOutcomeParser Error: ");
                console.log(err);
            });
        });
    }
}