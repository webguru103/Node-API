/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { each } from "bluebird";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { IRKCountry } from "../utils/redkings";
const countries = require('country-data').countries

export class SportCountryParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(data: IRKCountry) {
        let name = data.$.name;
        const sportId = data.SportId;
        const id = data.SportId + "." + data['$'].id;
        // get name by country code
        if (countries[name] && countries[name].name) name = countries[name].name;
        // add country
        await this.service.addCategory(id, CategoryType.SPORT_COUNTRY, sportId, name);
        // if leagues not found return
        if (!data.Tournament) return;
        // process leagues
        return each(data.Tournament, async league => {
            if (ParserBase.stopped) return;
            league.SportId = sportId;
            league.CountryId = id;
            return this.successor.processRequest(league).catch(err => {
                console.log('LeagueParser Error: ', err);
            });
        });
    }
}