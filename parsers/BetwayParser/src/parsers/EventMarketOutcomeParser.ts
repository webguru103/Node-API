/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventMarketOutcomeService } from "../../../BaseParser/src/bll/abstract/IEventMarketOutcomeService";
import { EventMarketOutcomeService } from "../../../BaseParser/src/bll/services/EventMarketOutcomeService";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";
import { IBetWayOutcome } from "../betway";
import { round, toNumber } from "lodash";

export class EventMarketOutcomeParser extends ParserBase {
    private eventMarketOutcomeService: IEventMarketOutcomeService = new EventMarketOutcomeService();

    async processRequest(selection: IBetWayOutcome) {
        const sportId = selection.SportId;
        const marketType = selection.MarketType;
        const eventMarketId = selection.EventMarketId;
        const selectionName = selection.$.cname;
        const status = EventStatus.ACTIVE;
        const id = selection.$.id;
        const odd = round(selection.$.price_dec, 2);
        let argument = toNumber(selection.Argument) || 0;
        //add event market outcome
        return this.eventMarketOutcomeService.addEventMarketOutcome(id, selectionName, selectionName, marketType, eventMarketId, sportId, odd, status, argument.toFixed(2));
    }
}