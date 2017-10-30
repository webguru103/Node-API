/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventMarketOutcomeService } from "../../../BaseParser/src/bll/abstract/IEventMarketOutcomeService";
import { EventMarketOutcomeService } from "../../../BaseParser/src/bll/services/EventMarketOutcomeService";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";
import { ISBSelection } from "../utils/sbtech";
import { toNumber } from "lodash";

export class EventMarketOutcomeParser extends ParserBase {
    private eventMarketOutcomeService: IEventMarketOutcomeService = new EventMarketOutcomeService();

    async processRequest(selection: ISBSelection) {
        const marketType = selection.MarketType;
        const eventMarketId = selection.EventMarketId;
        const id = selection.Id;
        const selectionName = selection.Name;
        const odd = selection.Odd;
        const argument = toNumber(selection.Argument) || 0;
        const status = EventStatus.ACTIVE;
        const sportId = selection.SportId;
        return this.eventMarketOutcomeService.addEventMarketOutcome(id, selectionName, selectionName, <string>marketType, <string>eventMarketId, <string>sportId, odd, status, argument.toFixed(2));
    }
}