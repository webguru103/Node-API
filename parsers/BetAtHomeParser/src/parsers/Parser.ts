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
import { IBetAtHomeData } from "../betAtHome";
import { queueRequest, setParsingOption, setRequestLimit } from "../../../../CommonJS/src/utils/http.util";

export class Parser extends ParserBase {
    constructor() {
        super();

        setParsingOption({ XMLParser: true });
        setRequestLimit(500);

        this.setSuccessor(new SportParser())
            .setSuccessor(new SportCountryParser())
            .setSuccessor(new LeagueParser())
            .setSuccessor(new EventParser())
            .setSuccessor(new EventMarketParser())
            .setSuccessor(new EventMarketOutcomeParser());
    }

    async processRequest(d?) {
        const data = await queueRequest(`https://www.bet-at-home.com/en/feed/feed?username=vipbet&password=Irimabaki621&jurisdictionid=1&type=1`);
        if (!data) {
            console.log("repeate call from 20 seconds ...");
            const parser = this;
            setTimeout(function () {
                parser.processRequest();
            }, 20000);
            return;
        }
        const feed: IBetAtHomeData = data.BAHFeed;
        // if there is no feed for some reason return
        if (!feed) return;
        const sports = feed.Sport;
        // if there is no sports
        if (!sports) return;
        await each(sports, async sport => {
            if (ParserBase.stopped) return;
            return this.successor.processRequest(sport).catch(err => {
                console.log('SportParser Error: ', err);
            });
        });
        // ParserBase.parsing = false;
        this.start();
        console.log("data parsing finished");
    }
}