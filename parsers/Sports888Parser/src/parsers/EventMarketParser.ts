/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventMarketService } from "../../../BaseParser/src/bll/abstract/IEventMarketService";
import { EventMarketService } from "../../../BaseParser/src/bll/services/EventMarketService";
import { each } from "bluebird";
import { isArray } from "util";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";

export class EventMarketParser extends ParserBase {
    private eventMarketService: IEventMarketService = new EventMarketService();

    async processRequest(market) {
        const sportId: string = market.sportId;
        const eventId: string = market.eventId;
        const marketType = market.betOfferType;
        const name: string = marketType.name;
        const id: string = market.eventId + "/" + marketType.id;
        let status: EventStatus = EventStatus.ACTIVE;
        if (new Date(market.closed) >= new Date()) status = EventStatus.CLOSED;

        await this.eventMarketService.addEventMarket(id, name, status, eventId, marketType.id, sportId, marketType.name);
        if (!isArray(market.outcomes)) return;
        return each(market.outcomes, selection => {
            if (ParserBase.stopped) return;
            selection['eventMarketId'] = id;
            selection['sportId'] = sportId;
            selection['marketType'] = marketType.name;
            selection['marketTypeId'] = marketType.id;
            selection['participants'] = market.participants;
            selection['marketStatus'] = status;
            return this.successor.processRequest(selection).catch(err => {
                console.log("EventMarketOutcomeParser Error: ");
                console.log(err);
            });
        });
    }
}