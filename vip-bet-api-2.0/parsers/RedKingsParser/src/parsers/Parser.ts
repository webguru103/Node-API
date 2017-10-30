/**
 * Created by   on 3/5/2017.
 */

import { HTTPUtil } from "../utils/httpUtil";
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { EventParser } from "./EventParser";
import { EventMarketParser } from "./EventMarketParser";
import { EventMarketOutcomeParser } from "./EventMarketOutcomeParser";
import { SportCountryParser } from "./SportCountryParser";
import { LeagueParser } from "./LeagueParser";
import { SportParser } from "./SportParser";
import { each } from "bluebird";
import { IRKFileList } from "../utils/redkings";
import { isArray } from "lodash";

export class Parser extends ParserBase {
    constructor() {
        super();

        this.setSuccessor(new SportParser())
            .setSuccessor(new SportCountryParser())
            .setSuccessor(new LeagueParser())
            .setSuccessor(new EventParser())
            .setSuccessor(new EventMarketParser())
            .setSuccessor(new EventMarketOutcomeParser());
    }

    async processRequest(d?) {
        const parser = this;
        const data: IRKFileList = await HTTPUtil.scheduleGetData("http://aws2.betredkings.com/feed/fileList.xml");
        
        if (!data || !data.fileList || !isArray(data.fileList.file)) {
            console.log("repeate call from 20 seconds ...");
            setTimeout(function () {
                parser.processRequest();
            }, 20000);
            return;
        }

        const sports: any[] = data.fileList.file.map(file => file._);
        await each(sports, async sport => {
            if (ParserBase.stopped) return;
            return this.successor.processRequest(sport).catch(err => {
                console.log('SportParser Error: ', err);
            });
        });
        
        // start parser again from 5 mins
        setTimeout(function () {
            parser.processRequest();
        }, 300000);
        console.log("data parsing finished");
    }
}