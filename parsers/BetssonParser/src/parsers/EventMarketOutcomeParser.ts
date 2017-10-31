/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventMarketOutcomeService } from "../../../BaseParser/src/bll/abstract/IEventMarketOutcomeService";
import { EventMarketOutcomeService } from "../../../BaseParser/src/bll/services/EventMarketOutcomeService";
import { EventStatus } from "../../../../CommonJS/src/domain/enums/event.status";
import { toNumber } from "lodash";
import { IBet365Participant } from "../utils/bet365.interface";

export class EventMarketOutcomeParser extends ParserBase {
    private eventMarketOutcomeService: IEventMarketOutcomeService = new EventMarketOutcomeService();

    async processRequest(selection: IBet365Participant) {
        const sportId = selection.SportID;
        const marketType = selection.MarketID;
        const eventMarketId = selection.EventMarketID;
        let selectionName = selection.Name;
        const status = selection.OddsDecimal === "OFF" ? EventStatus.SUSPENDED : EventStatus.ACTIVE;
        const id = selection.ID;
        const odd = toNumber(selection.OddsDecimal) || 0.99;
        const argument = toNumber(selection.Handicap);

        //find selection with participant name and replace it with home/away
        const participant = selection.Participants.find(p => p.name == selectionName);
        if (participant) {
            selectionName = participant.type;
        }
        //add event market outcome
        return this.eventMarketOutcomeService.addEventMarketOutcome(id, selectionName, selectionName, marketType, eventMarketId, sportId, odd, status, argument);
    }
}