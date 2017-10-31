/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventMarketService } from "../../../BaseParser/src/bll/abstract/IEventMarketService";
import { EventMarketService } from "../../../BaseParser/src/bll/services/EventMarketService";
import { each } from "bluebird";
import { IBetWayMarket } from "../betway";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";

export class EventMarketParser extends ParserBase {
    private eventMarketService: IEventMarketService = new EventMarketService();

    async processRequest(market: IBetWayMarket) {
        this.parseMarket(market);
        const sportId = market.SportId;
        const eventId = market.EventId;
        const marketType = market.$.cname;
        const name = market.$.cname;
        const id = market.$.id;
        const status = EventStatus.ACTIVE;
        const argument = market.$.handicap;
        // add event market
        await this.eventMarketService.addEventMarket(id, name, status, eventId, marketType, sportId, marketType);
        // get market selections
        const selections = market.Outcome;
        // if no selecion return;
        if (!selections) return;
        // process event market selections
        return each(selections, async selection => {
            if (ParserBase.stopped) return;
            selection.EventMarketId = id;
            selection.SportId = sportId;
            selection.MarketType = marketType;
            selection.Participants = market.Participants;
            selection.Argument = argument;
            return this.successor.processRequest(selection).catch(err => {
                console.log("EventMarketOutcomeParser Error: ");
                console.log(err);
            });
        });
    }

    private async parseMarket(market: IBetWayMarket) {
        if (market.$.cname.indexOf('-' + market.EventId) !== -1) market.$.cname = market.$.cname.substring(0, market.$.cname.indexOf('-' + market.EventId));
        market.$.cname = market.$.cname.replace('team-a', "home");
        market.$.cname = market.$.cname.replace('team-b', "away");
        if (market.$.cname.includes("total-goals") && (market.$.cname.match(/([0-9]{1,3}-[0-9]{1,3})/g) || []).length > 0) {
            const argumentString = (market.$.cname.match(/([0-9]{1,3}-[0-9]{1,3})/g) || [])[0];
            market.$.handicap = Number(argumentString.replace("-", "."));
            market.$.cname = market.$.cname.replace(argumentString, "");
        }
    }
}