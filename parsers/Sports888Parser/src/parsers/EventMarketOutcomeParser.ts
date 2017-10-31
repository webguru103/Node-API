/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventMarketOutcomeService } from "../../../BaseParser/src/bll/abstract/IEventMarketOutcomeService";
import { EventMarketOutcomeService } from "../../../BaseParser/src/bll/services/EventMarketOutcomeService";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";

export class EventMarketOutcomeParser extends ParserBase {
    private eventMarketOutcomeService: IEventMarketOutcomeService = new EventMarketOutcomeService();

    async processRequest(selection) {
        const sportId = selection.sportId;
        const marketType = selection.marketTypeId;
        const eventMarketId = selection.eventMarketId;
        let selectionName = selection.label;
        let status = selection.status === "OPEN" ? EventStatus.ACTIVE : EventStatus.SUSPENDED;
        if (selection.marketStatus !== EventStatus.ACTIVE) status = selection.marketStatus;
        let id = eventMarketId + "/" + selection.label;
        const odd = selection.odds / 1000;
        let argument = selection.line;
        if (argument) {
            argument = Number(argument / 1000).toFixed(2);
            id += "/" + argument;
        }

        //find selection with participant name and replace it with home/away
        let participant = selection.participants.find(p => p.name == selectionName);
        if (participant) {
            selectionName = participant.type;
        }
        //add event market outcome
        return this.eventMarketOutcomeService.addEventMarketOutcome(id, selectionName, selectionName, marketType, eventMarketId, sportId, odd, status, argument);
    }
}