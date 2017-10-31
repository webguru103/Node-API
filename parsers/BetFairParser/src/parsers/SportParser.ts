/**
 * Created by   on 3/5/2017.
 */

import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { each } from "bluebird";
import { isArray } from "lodash";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { ISport, BetFair } from "../betfair";

export class SportParser extends ParserBase {
    private categoryService: ICategoryService = new CategoryService();

    async processRequest(sport: ISport) {
        const countryId = "111." + sport.bf_sport_id;
        await this.categoryService.addCategory(sport.bf_sport_id, CategoryType.SPORT, undefined, sport.bf_sport_name);
        await this.categoryService.addCategory(countryId, CategoryType.SPORT_COUNTRY, sport.bf_sport_id, sport.bf_sport_name);
        // get leagues
        const leagues = await BetFair.getLeagues(sport.bf_sport_id);
        // check if responce is array
        if (!isArray(leagues)) return;
        // process leagues
        return each(leagues, async league => {
            // if parser stopped return
            if (ParserBase.stopped) return;
            // set market details
            league.bf_sport_id = sport.bf_sport_id;
            league.bf_country_id = countryId;
            // process market
            return this.successor.processRequest(league).catch(err => {
                console.log("LeagueParser Error: ");
                console.log(err);
            });
        });
    }
}