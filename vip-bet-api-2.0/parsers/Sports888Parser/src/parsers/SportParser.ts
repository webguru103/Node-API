/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { URLFactory } from "../utils/urlFactory";
import { HTTPUtil } from "../utils/httpUtil";
import { each } from "bluebird";
import { isArray } from "util";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";

export class SportParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(sportName) {
        let reqObj = URLFactory.getRequest(`https://e4-api.kambi.com/offering/api/v3/888dk/listView/${sportName}.json?market=ALL&lang=en_GB&channel_id=1`);
        let data = await HTTPUtil.scheduleGetData(reqObj);
        //pase json data
        let jsonData = JSON.parse(data);
        //takes events
        let events: any[] = jsonData.events;
        // if there is no event return;
        if (!isArray(events)) return;
        // send data to next successor
        return each(events, async event => {
            // if parser stopped
            if (ParserBase.stopped) return;
            event = event.event;
            //if event is live return
            if (event.state == "STARTED") return;
            // if winner type event return
            if (event.type == "ET_COMPETITION") return;
            // take sport
            let sport = event.path[0];
            // if sport not found return
            if (!sport) return;
            // add sport            
            await this.service.addCategory(sport.id, CategoryType.SPORT, undefined, sport.name);
            //send data to next succcessor
            event["sportId"] = sport.id;
            return this.successor.processRequest(event).catch(err => {
                console.log('SportCountryParser Error: ', err);
            });
        })
    }
}