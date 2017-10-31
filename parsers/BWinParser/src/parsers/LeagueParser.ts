/**
 * Created by   on 3/5/2017.
 */

import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { IBetFairLeague, Bwin } from "../utils/bwin";
import { CategoryType } from "../../../../CommonJS/src/domain/enums/category.type";
import { each } from "bluebird";
import { isArray } from "lodash";

export class LeagueParser extends ParserBase {
    private categoryService: ICategoryService = new CategoryService();

    async processRequest(league: IBetFairLeague) {
        await this.categoryService.addCategory(league.bf_parent_id, CategoryType.LEAGUE, league.bf_country_id, league.bf_parent_name, league.bf_sport_id);
        const events = await Bwin.getEvents(league.bf_parent_id);
        // check if responce is array
        if (!isArray(events)) return;
        // process markets
        return each(events, async event => {
            // if parser stopped return
            if (ParserBase.stopped) return;
            event.bf_sport_id = league.bf_sport_id;
            event.bf_country_id = league.bf_country_id;
            event.bf_league_id = league.bf_parent_id;
            // set market details
            return this.successor.processRequest(event).catch(err => {
                console.log("EventMarketParser Error: ");
                console.log(err);
            });
        });
    }
}