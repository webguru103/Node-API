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

    async processRequest(market) {
        let sportId: string = market.sportId;
        let eventId: string = market.eventId;

        let betType = market['bet-type'][0];

        let marketType = BetTypeUtil.getBetType(betType['$'].name);
        if (!marketType) return;

        let name: string = marketType.translation;
        let id: string = market['$'].id;
        let status = BetTypeUtil.getStatus(market['$'].state);
        let selections = market['outcome'];
        let argument = !betType['odds-value'] ? null : betType['odds-value'][0];

        //is handicap
        if (argument && argument.split(":").length == 2) {
            let splitted = argument.split(":");
            argument = Number(splitted[0]) - Number(splitted[1]);
        }

        if (argument) {
            argument = Number(argument).toFixed(2);
        }

        await this.eventMarketService.addEventMarket(id, name, status, eventId, marketType.name, sportId);
        return each(selections, selection => {
            if (ParserBase.stopped) return;
            selection['eventMarketId'] = id;
            selection['sportId'] = sportId;
            selection['marketType'] = marketType.name;
            selection['participants'] = market.participants;
            selection['argument'] = argument;
            return this.successor.processRequest(selection).catch(err => {
                console.log("EventMarketOutcomeParser Error:");
                console.log(err);
            });
        });
    }
}