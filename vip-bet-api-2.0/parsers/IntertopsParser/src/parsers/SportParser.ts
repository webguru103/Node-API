/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { each } from "bluebird";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { ISport } from "../intertops";
import { isArray } from "lodash";

export class SportParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(sport: ISport) {
        const country = { id: "1", n: "All" };
        // add categories
        await this.service.addCategory(sport.$.id, CategoryType.SPORT, undefined, sport.$.n);
        await this.service.addCategory(country.id, CategoryType.SPORT_COUNTRY, sport.$.id, country.n);
        // get leagues
        const leagues = sport.cat;
        if (!isArray(leagues)) return;
        return each(leagues, async league => {
            league.sportId = sport.$.id;
            league.countryId = "1";
            return this.successor.processRequest(league).catch(err => {
                console.log('LeagueParser Error: ', err);
            });
        })
    }
}