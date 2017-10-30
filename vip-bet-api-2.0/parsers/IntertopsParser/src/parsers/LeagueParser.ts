/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { each } from "bluebird";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { isArray } from "lodash";
import { ILeague } from "../intertops";

export class LeagueParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(league: ILeague) {
        const id = league.$.id;
        const name = league.$.n;
        const sportId = league.sportId;
        const countryId = league.countryId;
        // add league
        await this.service.addCategory(id, CategoryType.LEAGUE, countryId, name, sportId);
        // get events
        const events = league.m;
        if (!isArray(events)) return;
        return each(events, async event => {
            event.sportId = sportId;
            event.countryId = countryId;
            event.leagueId = id;
            return this.successor.processRequest(event).catch(err => {
                console.log('EventParser Error: ');
                console.log(err);
            });
        })
    }
}