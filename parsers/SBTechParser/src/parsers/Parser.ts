/**
 * Created by   on 3/5/2017.
 */

import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { EventMarketParser } from "./EventMarketParser";
import { EventMarketOutcomeParser } from "./EventMarketOutcomeParser";
import { each } from "bluebird";
import { parseString } from 'xml2js';
import { groupBy } from "lodash";
import { EventParser } from "./EventParser";
import { setRequestLimit, queueRequest } from "../../../../CommonJS/src/utils/http.util";
import { ISBTechEvent } from "../utils/sbtech";
export class Parser extends ParserBase {
    constructor() {
        super();

        setRequestLimit(10);

        this.setSuccessor(new EventParser())
            .setSuccessor(new EventMarketParser())
            .setSuccessor(new EventMarketOutcomeParser());
    }

    async processRequest(d?: any) {
        const data = await queueRequest("http://admin.livepartners.com/feeds/netbetcom?OddsStyle=DECIMAL");
        await this.parserMarkets(data);

        parseString(data, { trim: true }, async (err, result) => {
            const events: ISBTechEvent[] = result.Events.Event;
            // select event which does not have event but have id
            let filteredEvents = events.filter(e => e.$.MEID && !e.$.EventName);
            // group them
            const eventsWithID = groupBy(filteredEvents, '$.MEID');
            // select event with only names
            filteredEvents = events.filter(e => { return !e.$.MEID && e.$.EventName });
            // group event by EventName
            const eventsWithNames = groupBy(events, '$.EventName');
            // send to next parser
            (<EventParser>this.successor).eventsWithNames = eventsWithNames;
            // process events
            const eventIds = Object.keys(eventsWithID);
            await each(eventIds, async key => {
                if (ParserBase.stopped) return;
                return this.successor.processRequest(eventsWithID[key]);
            });
            // ParserBase.parsing = false;
            this.start();
            console.log("data parsing finished");
        })
    }

    private async parserMarkets(data: string): Promise<any> {
        const events = data.split("<Events>")[0];
        const markets = events.split('<?xml version="1.0" encoding="utf-8"?>')[1].split("-->\r\n");

        await each(markets, async typeString => {
            if (!typeString || typeString.length == 0) return;

            typeString = typeString.split("<!-- ")[1];
            let typeId = typeString.split(" ")[0];
            let typeName = typeString.substring(typeId.length).trim();
            ParserBase.markets[typeId] = typeName;
        });
    }
}