/**
 * Created by   on 3/5/2017.
 */

import { ParserBase } from "../../../../BaseParser/src/ParserBase";
import { IEventService } from "../../../../BaseParser/src/bll/abstract/IEventService";
import { EventService } from "../../../../BaseParser/src/bll/services/EventService";
import { BetTypeUtil } from "../../utils/BetTypeUtil";
import { each } from "bluebird";

export class EventParser extends ParserBase {
    private eventService: IEventService = new EventService();

    async processRequest(events) {
        if (!events) return;

        return each(events, async (event) => {
            if (ParserBase.stopped) return;
            let id: string = event['$'].id;
            let status = BetTypeUtil.getStatus(event['$'].state);

            let eventDb = await this.eventService.updateEvent(id, status);
            if (!eventDb) return;

            return this.successor.processRequest(event['market']).catch(err => {
                console.log("EventMarketParser Error: ");
                console.log(err);
            });
        });
    }
}