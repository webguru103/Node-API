/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventMarketOutcomeService } from "../../../BaseParser/src/bll/abstract/IEventMarketOutcomeService";
import { EventMarketOutcomeService } from "../../../BaseParser/src/bll/services/EventMarketOutcomeService";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";
import { IBetAtHomeOdd } from "../betAtHome";

export class EventMarketOutcomeParser extends ParserBase {
    private eventMarketOutcomeService: IEventMarketOutcomeService = new EventMarketOutcomeService();

    async processRequest(selection: IBetAtHomeOdd) {
        const sportId = selection.SportId;
        const marketType = selection.MarketType;
        const eventMarketId = selection.EventMarketId;
        const selectionName = selection.$.Name;
        const status = EventStatus.ACTIVE;
        const id = eventMarketId + "_" + selection.$.Id;
        const odd = selection.$.Value;
        let argument: number = 0;
        if (selection.Argument1 && selection.Argument2) {
            if (selection.$.Id === "1" && selection.$.Name === "1") {
                argument = Number(selection.Argument1);
            } else if (selection.$.Id === "2" && selection.$.Name === "2") {
                argument = Number(selection.Argument2) * -1;
            }
        } else if (selection.Argument1) {
            argument = Number(selection.Argument1);
        }
        //add event market outcome
        return this.eventMarketOutcomeService.addEventMarketOutcome(id, selectionName, selectionName, marketType, eventMarketId, sportId, odd, status, argument.toFixed(2));
    }
}