/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventMarketOutcomeService } from "../../../BaseParser/src/bll/abstract/IEventMarketOutcomeService";
import { EventMarketOutcomeService } from "../../../BaseParser/src/bll/services/EventMarketOutcomeService";
import { toNumber } from "lodash";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";
import { ISelection } from "../intertops";

export class EventMarketOutcomeParser extends ParserBase {
    private eventMarketOutcomeService: IEventMarketOutcomeService = new EventMarketOutcomeService();
    async processRequest(selection: ISelection) {
        this.parseSelection(selection);
        const sportId = selection.sportId;
        const marketType = selection.marketId;
        const eventMarketId = selection.eventMarketId;
        const selectionName = selection._;
        const status = EventStatus.ACTIVE;
        const id = selection.$.id;
        const odd = toNumber(selection.$.o) || 1;
        const argument = toNumber(selection.$.p).toFixed(2);
        //add event market outcome
        return this.eventMarketOutcomeService.addEventMarketOutcome(id, selectionName, selectionName, marketType, eventMarketId, sportId, odd, status, argument);
    }

    private parseSelection(selection: ISelection) {
        // replace participant names
        selection.participants.map(participant => {
            selection._ = selection._.replace(new RegExp(participant.name, "g"), participant.type);
        })
        // raplace such names: Tie - (Away +1)
        selection._ = selection._.replace(/(\s-\s\([a-zA-Z]{1,10} [-+]{1}[0-9]{1,5}\))/g, "");
        // 
        if ((selection._.match(/(#[0-9]{1,3}-[0-9]{1,3})/g) || []).length > 0) {
            // Home #3-1
            const score = (selection._.match(/(#[0-9]{1,3}-[0-9]{1,3})/g) || [])[0].replace(/#/g, "").trim().split("-");
            selection._ = score.join(":");
            if (selection._.includes("Away")) selection._ = score.reverse().join(":");
        } else if (!selection._.match(/([0-9.]{1,6} - [0-9.]{1,6})/g) && (selection._.match(/(\s[0-9.]{1,6})/g) || []).length > 0) {
            // Over 2.5
            selection.$.p = (selection._.match(/(\s[0-9.]{1,6})/g) || [])[0].trim();
            selection._ = selection._.replace(/(\s[0-9.]{1,6})/g, "").trim();
        } else if ((selection._.match(/(\s\([-+]{1}[0-9.]{1,6}\))/g) || []).length > 0) {
            // Home (-1)
            // Away (+1)
            selection._ = selection._.replace(/(\s\([-+]{1}[0-9.]{1,6}\))/g, "").trim();
        }
    }
}