/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventMarketOutcomeService } from "../../../BaseParser/src/bll/abstract/IEventMarketOutcomeService";
import { EventMarketOutcomeService } from "../../../BaseParser/src/bll/services/EventMarketOutcomeService";
import { IRKOdd } from "../utils/redkings";
import { toNumber } from "lodash";

export class EventMarketOutcomeParser extends ParserBase {
    private eventMarketOutcomeService: IEventMarketOutcomeService = new EventMarketOutcomeService();

    async processRequest(selection: IRKOdd) {
        const marketType = selection.MarketType;
        const marketTypeId = selection.MarketTypeId;
        const eventMarketId = selection.EventMarketId;
        let selectionName = selection.$.outcome;
        const status = selection.Status;
        const id = selection.$.id;
        const odd = selection._;
        let argument = selection.$.score || selection.$.handicap || selection.$.margin || selection.$.corner;
        if (argument) {
            argument = toNumber(argument).toFixed(2);
        }

        if (!selectionName) return;
        if (selection.$.playerName) return;

        const marketTypeIdsWithTeamNames = ["75", "113", "114", "115", "129", "139", "149"];

        if (Number(selectionName) > 21 || marketTypeIdsWithTeamNames.indexOf(marketTypeId) != -1) {
            selection.Participants.forEach(participant => {
                if (participant.id.toString() == selectionName) {
                    selectionName = participant.type;
                }
            })
        }

        if (selectionName.toString() == "0") {
            selectionName = "X"
        }

        const teamId = selection.$.teamId;

        if (teamId && teamId != 0) {
            selection.Participants.forEach(participant => {
                if (toNumber(participant.id) == teamId) {
                    selectionName = participant.type + " " + selectionName;
                }
            })
        } else if (teamId == 0) {
            selectionName = "X " + selectionName;
        }

        return this.eventMarketOutcomeService.addEventMarketOutcome(id, selectionName, selectionName, marketType, eventMarketId, selection.SportId, odd, status, argument);
    }
}