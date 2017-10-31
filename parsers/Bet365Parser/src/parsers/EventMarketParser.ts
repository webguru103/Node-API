/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventMarketService } from "../../../BaseParser/src/bll/abstract/IEventMarketService";
import { EventMarketService } from "../../../BaseParser/src/bll/services/EventMarketService";
import { each } from "bluebird";
import { every } from "lodash";
import { IBet365Market } from "../utils/bet365.interface";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";

export class EventMarketParser extends ParserBase {
    private eventMarketService: IEventMarketService = new EventMarketService();

    async processRequest(market: IBet365Market) {
        // dont parse live markets
        if (market.EventComment === "Live In-Play.") return;
        // 
        const sportId: string = market.SportID;
        const eventId: string = market.EventID;
        const marketType = market.$.ID;
        const name: string = market.$.Name;
        const id: string = eventId + "/" + marketType;
        // if all outcomes closed
        const status: EventStatus = every(market.Participant, ["OddsDecimal", "OFF"]) ? EventStatus.SUSPENDED : EventStatus.ACTIVE;
        // add event market
        await this.eventMarketService.addEventMarket(id, name, status, eventId, marketType, sportId, name);
        if (market.Participant === undefined) return;
        return each(market.Participant, async selection => {
            if (ParserBase.stopped) return;
            selection.EventMarketID = id;
            selection.SportID = sportId;
            selection.MarketName = name;
            selection.MarketID = marketType;
            selection.Participants = market.Participants;
            return this.successor.processRequest(selection).catch(err => {
                console.log("EventMarketOutcomeParser Error: ");
                console.log(err);
            });
        });
    }
}