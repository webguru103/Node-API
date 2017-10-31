/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventMarketOutcomeService } from "../../../BaseParser/src/bll/abstract/IEventMarketOutcomeService";
import { EventMarketOutcomeService } from "../../../BaseParser/src/bll/services/EventMarketOutcomeService";
import { toNumber } from "lodash";
import { IBet365Participant } from "../utils/bet365.interface";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";

export class EventMarketOutcomeParser extends ParserBase {
    private eventMarketOutcomeService: IEventMarketOutcomeService = new EventMarketOutcomeService();
    async processRequest(selection: IBet365Participant) {
        this.parseSelection(selection);
        const sportId = selection.SportID;
        const marketType = selection.MarketID;
        const eventMarketId = selection.EventMarketID;
        const selectionName = selection.Name;
        const status = selection.OddsDecimal === "OFF" ? EventStatus.SUSPENDED : EventStatus.ACTIVE;
        const id = selection.ID;
        const odd = toNumber(selection.OddsDecimal) || 0.99;
        const argument = toNumber(selection.Handicap).toFixed(2);
        //add event market outcome
        return this.eventMarketOutcomeService.addEventMarketOutcome(id, selectionName, selectionName, marketType, eventMarketId, sportId, odd, status, argument);
    }

    private parseSelection(selection: IBet365Participant) {
        // replace participant names
        selection.Participants.map(participant => {
            selection.Name = selection.Name.replace(new RegExp(participant.name, "g"), participant.type);
        })
        // raplace such names: Tie - (Away +1)
        selection.Name = selection.Name.replace(/(\s-\s\([a-zA-Z]{1,10} [-+]{1}[0-9]{1,5}\))/g, "");
        // 
        if ((selection.Name.match(/(#[0-9]{1,3}-[0-9]{1,3})/g) || []).length > 0) {
            // Home #3-1
            const score = (selection.Name.match(/(#[0-9]{1,3}-[0-9]{1,3})/g) || [])[0].replace(/#/g, "").trim().split("-");
            selection.Name = score.join(":");
            if (selection.Name.includes("Away")) selection.Name = score.reverse().join(":");
        } else if (!selection.Name.match(/([0-9.]{1,6} - [0-9.]{1,6})/g) && (selection.Name.match(/(\s[0-9.]{1,6})/g) || []).length > 0) {
            // Over 2.5
            selection.Handicap = (selection.Name.match(/(\s[0-9.]{1,6})/g) || [])[0].trim();
            selection.Name = selection.Name.replace(/(\s[0-9.]{1,6})/g, "").trim();
        } else if ((selection.Name.match(/(\s\([-+]{1}[0-9]{1,6}\))/g) || []).length > 0) {
            // Home (-1)
            // Away (+1)
            selection.Name = selection.Name.replace(/(\s\([-+]{1}[0-9]{1,6}\))/g, "").trim();
        }
    }
}