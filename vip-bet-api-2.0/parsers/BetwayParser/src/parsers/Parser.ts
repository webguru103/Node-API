/**
 * Created by   on 3/5/2017.
 */

import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { EventParser } from "./EventParser";
import { EventMarketParser } from "./EventMarketParser";
import { EventMarketOutcomeParser } from "./EventMarketOutcomeParser";
import { each } from "bluebird";
import { BetWayService } from "../betway";
import { setParsingOption, setRequestLimit } from "../../../../CommonJS/src/utils/http.util";

export class Parser extends ParserBase {
    constructor() {
        super();
        // set http util settings
        setParsingOption({ XMLParser: true });
        setRequestLimit(500);
        // set parsers chain
        this
            .setSuccessor(new EventParser())
            .setSuccessor(new EventMarketParser())
            .setSuccessor(new EventMarketOutcomeParser());
    }

    async processRequest(d?) {
        // get events
        const data = await BetWayService.getEvents();
        // 
        const feed = data.EventList;
        // if there is no feed for some reason return
        if (!feed) return;
        const events = feed.Event;
        // if there is no sports
        if (!events) return;
        await each(events, async event => {
            if (ParserBase.stopped) return;
            return this.successor.processRequest(event).catch(err => {
                console.log('SportParser Error: ', err);
            });
        });
        this.start();
        console.log("data parsing finished");
    }
}