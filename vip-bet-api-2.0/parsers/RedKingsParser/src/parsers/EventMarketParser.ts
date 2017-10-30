/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventMarketService } from "../../../BaseParser/src/bll/abstract/IEventMarketService";
import { EventMarketService } from "../../../BaseParser/src/bll/services/EventMarketService";
import { map } from "bluebird";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";
import { IRKMarket } from "../utils/redkings";

export class EventMarketParser extends ParserBase {
    private eventMarketService: IEventMarketService = new EventMarketService();

    async processRequest(market: IRKMarket) {
        const sportId: string = market.SportId;
        const eventId: string = market.EventId;
        const marketType = market.$.type + " - " + market.$.scope;
        const marketTypeId = market.$.typeId;
        const name: string = marketType;
        const id: string = eventId + "/" + name;
        // add event market
        await this.eventMarketService.addEventMarket(id, name, EventStatus.ACTIVE, eventId, marketType, sportId);
        // process odds
        return map(market.Odds, async selection => {
            if (ParserBase.stopped) return;
            selection.EventMarketId = id;
            selection.Status = EventStatus.ACTIVE;
            selection.SportId = sportId;
            selection.MarketType = marketType;
            selection.MarketTypeId = marketTypeId;
            selection.Participants = market.Participants;
            return this.successor.processRequest(selection).catch(err => {
                console.log("EventMarketOutcomeParser Error: ");
                console.log(err);
            });
        });
    }
}