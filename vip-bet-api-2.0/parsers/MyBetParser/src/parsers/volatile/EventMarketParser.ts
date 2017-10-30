/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../../BaseParser/src/ParserBase";
import { IEventMarketService } from "../../../../BaseParser/src/bll/abstract/IEventMarketService";
import { EventMarketService } from "../../../../BaseParser/src/bll/services/EventMarketService";
import { BetTypeUtil } from "../../utils/BetTypeUtil";
import { each } from "bluebird";

export class EventMarketParser extends ParserBase {
    private eventMarketService: IEventMarketService = new EventMarketService();

    async processRequest(markets) {
        if (!markets) return;

        return each(markets, async (market) => {
            if (ParserBase.stopped) return;
            let id: string = market['$'].id;
            let status = BetTypeUtil.getStatus(market['$'].state);

            let eventMarket = await this.eventMarketService.updateEventMarket(id, status);
            if (!eventMarket) return;
            return this.successor.processRequest(market['outcome']).catch(err => {
                console.log("EventMarketOutcomeParser Error: ");
                console.log(err);
            });
        });
    }
}