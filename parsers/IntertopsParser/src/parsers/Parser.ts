/**
 * Created by   on 3/5/2017.
 */

import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { EventParser } from "./EventParser";
import { EventMarketParser } from "./EventMarketParser";
import { EventMarketOutcomeParser } from "./EventMarketOutcomeParser";
import { LeagueParser } from "./LeagueParser";
import { SportParser } from "./SportParser";
import { each } from "bluebird";
import { setParsingOption, setRequestLimit } from "../../../../CommonJS/src/utils/http.util"
import { Intertops } from "../intertops";
import { isArray } from "lodash";
export class Parser extends ParserBase {
    constructor() {
        super();

        setParsingOption({ XMLParser: true });
        setRequestLimit(100);

        this.setSuccessor(new SportParser())
            .setSuccessor(new LeagueParser())
            .setSuccessor(new EventParser())
            .setSuccessor(new EventMarketParser())
            .setSuccessor(new EventMarketOutcomeParser());
    }

    async processRequest(d = 600000) {
        const parser = this;
        const data = await Intertops.getData(d);
        // if no data received repeat call
        if (!data || !data.result || !isArray(data.result.data) || !data.result.data[0] || !isArray(data.result.data[0].s)) {
            console.log("repeate call after 20 seconds ...");
            setTimeout(function () {
                parser.processRequest(30);
            }, 20000);
            return;
        }
        // parse sports
        const sports = data.result.data[0].s;
        await each(sports, async sport => {
            if (ParserBase.stopped) return;
            return this.successor.processRequest(sport).catch(err => {
                console.log('SportParser Error: ', err);
            });
        });
        // parsing finished
        console.log("data parsing finished");
        // restart service after 5 mins
        setTimeout(function () {
            parser.processRequest(30);
        }, 300000);
    }
}