/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventMarketOutcomeService } from "../../../BaseParser/src/bll/abstract/IEventMarketOutcomeService";
import { EventMarketOutcomeService } from "../../../BaseParser/src/bll/services/EventMarketOutcomeService";
import { round } from "lodash";
import { ISelection } from "../betfair";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";

export class EventMarketOutcomeParser extends ParserBase {
    private eventMarketOutcomeService: IEventMarketOutcomeService = new EventMarketOutcomeService();
    // private selection_names: string[] = [];
    async processRequest(selection: ISelection) {
        this.parseSelection(selection);
        const sportId = selection.bf_sport_id;
        const marketType = selection.market_type;
        const eventMarketId = selection.bf_market_id;
        const selectionName = selection.selection_name.toLowerCase();

        if (selectionName.match(/[0-9]{1,3} or [0-9]{1,3}/g)) return;

        const status = EventStatus.ACTIVE;
        const id = selection.sp_market_id + "." + selection.bf_selection_id;
        const odd = round(selection.odd, 2);
        let argument = selection.handicap;
        //add event market outcome
        return this.eventMarketOutcomeService.addEventMarketOutcome(id, selectionName, selectionName, marketType, eventMarketId, sportId, odd, status, argument);
    }

    private parseSelection(selection: ISelection) {
        selection.selection_name = selection.selection_name
            .replace(" " + selection.handicap + " ", " ")
            .replace(" " + selection.handicap, " ")
        if (!selection.selection_name.match(/(^[0-9.]{1,6} - [0-9.]{1,6})/g) && (selection.selection_name.match(/\s([0-9.]{1,6} - [0-9.]{1,6})/g) || []).length === 1) {
            // something x - y
            // strings starting with "x - y" not included
            selection.handicap = (selection.selection_name.match(/\s([0-9.]{1,6} - [0-9.]{1,6})/g) || [])[0];
            selection.selection_name = selection.selection_name.replace(selection.handicap, "").trim();
        } else if (!selection.selection_name.match(/\s(0[0-9.]{1,6})/g) && !selection.selection_name.match(/(^[0-9.]{1,6} - [0-9.]{1,6})/g) && (selection.selection_name.match(/\s([0-9.]{1,6})/g) || []).length === 1) {
            // something 0.5,something 4
            selection.handicap = (selection.selection_name.match(/\s([0-9.]{1,6})/g) || [])[0];
            selection.selection_name = selection.selection_name.replace(selection.handicap, "").trim();
        }
    }
}