/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { each } from "bluebird";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { IBetAtHomeRegion } from "../betAtHome";

export class SportCountryParser extends ParserBase {
    private service: ICategoryService = new CategoryService();
    async processRequest(country: IBetAtHomeRegion) {
        // add sport country
        await this.service.addCategory(country.$.Id, CategoryType.SPORT_COUNTRY, country.SportId, country.$.Name, country.SportId);
        // get leagues
        const leagues = country.EventGroup;
        // if no leagues return
        if (!leagues) return;
        return each(leagues, async league => {
            // if parser stopped return
            if (ParserBase.stopped) return;
            league.SportId = country.SportId;
            league.CountryId = country.$.Id;
            return this.successor.processRequest(league);
        })
    }
}