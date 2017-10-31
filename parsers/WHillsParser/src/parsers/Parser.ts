/**
 * Created by   on 3/5/2017.
 */

import { HTTPUtil } from "../utils/httpUtil";
import { URLFactory } from "../utils/urlFactory";
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { EventParser } from "./EventParser";
import { EventMarketParser } from "./EventMarketParser";
import { EventMarketOutcomeParser } from "./EventMarketOutcomeParser";
import { SportCountryParser } from "./SportCountryParser";
import { LeagueParser } from "./LeagueParser";
import { each } from "bluebird";

export class Parser extends ParserBase {
    constructor() {
        super();

        this.setSuccessor(new SportCountryParser())
            .setSuccessor(new LeagueParser())
            .setSuccessor(new EventParser())
            .setSuccessor(new EventMarketParser())
            .setSuccessor(new EventMarketOutcomeParser());
    }

    async processRequest(data: any) {
        const reqObj = URLFactory.getRequest("http://cachepricefeeds.williamhill.com:80/openbet_cdn");
        console.log(reqObj);
        const countriesData = await HTTPUtil.scheduleGetData(reqObj);
        console.log(countriesData);
        const countries = countriesData['class'];

        await each(countries, async (country) => {
            if (ParserBase.stopped) return;
            return this.successor.processRequest(country).catch(err => {
                console.log('SportCountryParser Error: ', err);
            });
        });
        // ParserBase.parsing=false;
        this.start();
    }
}