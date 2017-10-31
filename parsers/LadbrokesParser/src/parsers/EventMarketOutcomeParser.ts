/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { parseSelection } from "../utils/outcome.util";
import { IEventMarketOutcomeService } from "../../../BaseParser/src/bll/abstract/IEventMarketOutcomeService";
import { EventMarketOutcomeService } from "../../../BaseParser/src/bll/services/EventMarketOutcomeService";
import { isNumber, toNumber } from "lodash";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";
import { ISelection } from "../utils/ladbrokes";

export class EventMarketOutcomeParser extends ParserBase {
    private eventMarketOutcomeService: IEventMarketOutcomeService = new EventMarketOutcomeService();
    async processRequest(selection: ISelection) {
        // parse selection argument and name
        parseSelection(selection);
        // if is handicap and participant type is away multiply by minus 1
        if (selection.isHandicapMarket) {
            if (selection.selectionName === "Away") {
                selection.argument = toNumber(selection.argument) * -1;
            }
        }
        // get status
        const status = this.getStatus(selection.selectionStatus);
        const odd: number = selection.currentPrice ? selection.currentPrice.decimalPrice : 1;
        // 
        return this.eventMarketOutcomeService.addEventMarketOutcome(
            selection.selectionKey.toString(), selection.selectionName, selection.selectionName, selection.marketName,
            selection.marketKey.toString(), selection.classKey.toString(),
            odd, status, isNumber(selection.argument) ? selection.argument.toFixed(2) : selection.argument);
    }

    private getStatus(statusString: string): EventStatus {
        let status = EventStatus.SUSPENDED;
        if (statusString === "Suspended") {
            status = EventStatus.SUSPENDED;
        } else if (statusString === "Active") {
            status = EventStatus.ACTIVE;
        }
        return status;
    }
}