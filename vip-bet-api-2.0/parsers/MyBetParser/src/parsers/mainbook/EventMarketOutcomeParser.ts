/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../../BaseParser/src/ParserBase";
import { IEventMarketOutcomeService } from "../../../../BaseParser/src/bll/abstract/IEventMarketOutcomeService";
import { EventMarketOutcomeService } from "../../../../BaseParser/src/bll/services/EventMarketOutcomeService";
import { BetTypeUtil } from "../../utils/BetTypeUtil";

export class EventMarketOutcomeParser extends ParserBase {
    private eventMarketOutcomeService: IEventMarketOutcomeService = new EventMarketOutcomeService();

    async processRequest(selection) {
        let argument = selection.argument;
        let marketType = selection.marketType;
        let eventMarketId = selection.eventMarketId;

        let selectionType = BetTypeUtil.getOutcomeType(selection['$']['outcome-type-name']);
        if (!selectionType) return;

        let selectionName = selectionType.translation;

        let status = BetTypeUtil.getStatus(selection['$'].state);
        let id = selection['$'].id;
        let odd = selection['_'];
        let sportId = selection.sportId;

        if (!selectionName) return;
        if (selection['$'].playerName) return;

        if (Number(selectionName) > 21) {
            selection.participants.forEach(participant => {
                if (participant.id.toString() == selectionName) {
                    selectionName = participant.type;
                }
            })
        } else if (selectionName == 0) {
            selectionName = "X"
        }

        let teamId = selection['$']['teamId'];

        if (teamId && teamId != 0) {
            selection.participants.forEach(participant => {
                if (participant.id.toString() == teamId) {
                    selectionName = participant.type + " " + selectionName;
                }
            })
        } else if (teamId == 0) {
            selectionName = "X " + selectionName;
        }

        return this.eventMarketOutcomeService.addEventMarketOutcome(id, selectionName, selectionType.name, marketType, eventMarketId, sportId, odd, status, argument);
    }
}