/**
 * Created by   on 3/5/2017.
 */

import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { EventParser } from "./EventParser";
import { EventMarketParser } from "./EventMarketParser";
import { EventMarketOutcomeParser } from "./EventMarketOutcomeParser";
import { each } from "bluebird";
import { SportParser } from "./SportParser";
import { LeagueParser } from "./LeagueParser";
import { isArray, sortBy } from "lodash";
import { BetFair } from "../betfair";

export class Parser extends ParserBase {
    constructor() {
        super();

        this.setSuccessor(new SportParser())
            .setSuccessor(new LeagueParser())
            .setSuccessor(new EventParser())
            .setSuccessor(new EventMarketParser())
            .setSuccessor(new EventMarketOutcomeParser());
    }

    async processRequest(d?) {
        let sports = await BetFair.getSports();
        // check if responce is array
        if (!isArray(sports)) return;
        // if there is no sports
        if (!sports) return;
        sports = sortBy(sports, "bf_sport_id");
        await each(sports, async sport => {
            if (ParserBase.stopped) return;
            return this.successor.processRequest(sport).catch(err => {
                console.log('SportParser Error: ', err);
            });
        });
        this.start();
        console.log("data parsing finished");
    }
}