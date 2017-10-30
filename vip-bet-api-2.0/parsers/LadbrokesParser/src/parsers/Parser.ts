/**
 * Created by   on 3/5/2017.
 */

import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { EventParser } from "./EventParser";
import { EventMarketParser } from "./EventMarketParser";
import { EventMarketOutcomeParser } from "./EventMarketOutcomeParser";
import { SportCountryParser } from "./SportCountryParser";
import { LeagueParser } from "./LeagueParser";
import { SportParser } from "./SportParser";
import { each } from "bluebird";
import { Ladbrokes } from "../utils/ladbrokes";
import { isArray } from "lodash";
import { setParsingOption, setRequestLimit } from "../../../../CommonJS/src/utils/http.util";
import { ResultParser } from "./ResultParser";

export class Parser extends ParserBase {
    resultParser: ParserBase;
    constructor() {
        super();
        // resulting parser
        this.resultParser = new ResultParser();
        // set http options
        setParsingOption({ JSONParser: true });
        setRequestLimit(2);
        // set data process chain
        this.setSuccessor(new SportParser())
            .setSuccessor(new SportCountryParser())
            .setSuccessor(new LeagueParser())
            .setSuccessor(new EventParser())
            .setSuccessor(new EventMarketParser())
            .setSuccessor(new EventMarketOutcomeParser());
    }

    async processRequest(d?) {
        // parse results
        await this.resultParser.start();
        // get classes
        const data = await Ladbrokes.GetClasses();
        // if data empty retry in 20 seconds
        if (!data || !data.classes || !data.classes.class) {
            console.log("repeate call from 20 seconds ...");
            const parser = this;
            setTimeout(function () {
                parser.processRequest();
            }, 20000);
            return;
        };
        // get sports
        const sports = isArray(data.classes.class) ? data.classes.class : [data.classes.class];
        // parse sports
        await each(sports, async sport => {
            if (ParserBase.stopped) return;
            return this.successor.processRequest(sport).catch(err => {
                console.log('SportParser Error: ', err);
            });
        })
        // finished
        console.log("parsing finished");
        // start again
        this.start();
    }
}