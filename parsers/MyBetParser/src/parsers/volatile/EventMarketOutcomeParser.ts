/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../../BaseParser/src/ParserBase";
import { IEventMarketOutcomeService } from ".../../../../BaseParser/src/bll/abstract/IEventMarketOutcomeService";
import { EventMarketOutcomeService } from "../../../../BaseParser/src/bll/services/EventMarketOutcomeService";
import { BetTypeUtil } from "../../utils/BetTypeUtil";
import { each } from "bluebird";

export class EventMarketOutcomeParser extends ParserBase {
    private eventMarketOutcomeService: IEventMarketOutcomeService = new EventMarketOutcomeService();

    async processRequest(selections) {
        return each(selections, async selection => {
            if (ParserBase.stopped) return;
            let id = selection['$'].id;
            let odd = selection['_'];
            let status = BetTypeUtil.getStatus(selection['$'].state);
            const selectionDb = await this.eventMarketOutcomeService.getEventMarketOutcome(id);
            return this.eventMarketOutcomeService.updateEventMarketOutcome(id, odd, status, selectionDb.map_id);
        });
    }
}