/**
 * Created by   on 3/5/2017.
 */

import { HTTPUtil } from "../../utils/httpUtil";
import { URLFactory } from "../../utils/urlFactory";
import { ParserBase } from "../../../../BaseParser/src/ParserBase";
import { LeagueParser } from "./LeagueParser";
import { EventParser } from "./EventParser";
import { EventMarketParser } from "./EventMarketParser";
import { EventMarketOutcomeParser } from "./EventMarketOutcomeParser";

export class VolatileParser extends ParserBase {
    constructor() {
        super();

        this.setSuccessor(new LeagueParser())
            .setSuccessor(new EventParser())
            .setSuccessor(new EventMarketParser())
            .setSuccessor(new EventMarketOutcomeParser());
    }

    async processRequest(d?) {
        let reqObj = URLFactory.getRequest("https://b2bproxy.mybet.com/b2b-api/v2/rest/betting-program/main/volatile");
        let data = await HTTPUtil.scheduleGetData(reqObj);
        if (!data) return;
        data = data['betting-program'];
        await this.successor.processRequest(data).catch(err => {
            console.log("LeagueParser Error:");
            console.log(err);
        });
        ParserBase.parsing = false;
        console.log("volatile parsing finished");
    }
}