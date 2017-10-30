/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { parseSelection } from "../utils/market.util";
import { IEventMarketOutcomeService } from "../../../BaseParser/src/bll/abstract/IEventMarketOutcomeService";
import { EventMarketOutcomeService } from "../../../BaseParser/src/bll/services/EventMarketOutcomeService";

export class EventMarketOutcomeParser extends ParserBase {
    private eventMarketOutcomeService: IEventMarketOutcomeService = new EventMarketOutcomeService();
    async processRequest(selection: any) {
        let argument = selection['$'].handicap;

        let selectionName = this.replaceSelectionName(selection['$'].name, selection.participants, argument);
        let parsedSelection = parseSelection(selectionName, selection.marketType);
        selectionName = parsedSelection.name;
        if (parsedSelection.argument) argument = parsedSelection.argument;
        let status = selection.status;
        let id = selection['$'].id;
        let sportId = selection.sportId;
        let odd = selection['$'].oddsDecimal;
        let marketType = selection.marketType;
        let eventMarketId = selection.eventMarketId;

        if (argument) {
            argument = Number(argument).toFixed(2);
        } else {
            argument = undefined;
        }

        return this.eventMarketOutcomeService.addEventMarketOutcome(id, selectionName, selectionName, marketType, eventMarketId, sportId, odd, status, argument);
    }

    private replaceSelectionName(name: string, participants: any[], argument: string): string {
        name = name.replace(/'/g, "");
        participants.forEach(participant => {
            participant.name = participant.name.replace(/'/g, "");
            name = name.replace(new RegExp(participant.name, 'g'), participant.type);
            name = name.replace(participant.name, participant.type);
        });
        name = name.replace(new RegExp(Number(argument).toString(), 'g'), "");
        name = name.replace(/  +/g, '');
        return name;
    }
}