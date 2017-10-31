/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { each } from "bluebird";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { ISubType } from "../utils/ladbrokes";
import { isArray } from "lodash";

export class LeagueParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(data: ISubType) {
        const id = data.subTypeKey.toString();
        const sportId = data.classKey.toString();
        const countryId = data.typeKey.toString();
        const name = data.subTypeName;
        // dont parse unsupported leagues
        if (name == "Perf League 2") return;
        // add league
        await this.service.addCategory(id, CategoryType.LEAGUE, countryId, name, sportId);
        // if events empty return
        if (!data.events || !data.events.event) return;
        // get league events
        const events = isArray(data.events.event) ? data.events.event : [data.events.event];
        // process events
        return each(events, async event => {
            if (ParserBase.stopped) return;
            event.classKey = data.classKey;
            event.typeKey = data.typeKey;
            event.subTypeKey = data.subTypeKey;
            return this.successor.processRequest(event).catch(err => {
                console.log('EventParser Error: ', err);
            });
        });
    }
}