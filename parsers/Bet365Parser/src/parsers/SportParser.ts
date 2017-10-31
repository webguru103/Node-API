/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { each } from "bluebird";
import { IBet365Data } from "../utils/bet365.interface";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { queueRequest } from "../../../../CommonJS/src/utils/http.util";

export class SportParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(sportURL) {
        const data: IBet365Data = await queueRequest(sportURL);
        // sport and country
        const sport = data.Sport;
        sport.ID = sport.$.Name;
        const country: any = { ID: "1", Name: "All" };

        await this.service.addCategory(sport.ID, CategoryType.SPORT, undefined, sport.$.Name);
        await this.service.addCategory(country.ID, CategoryType.SPORT_COUNTRY, sport.ID, country.Name);
        // get leagues
        const leagues = sport.EventGroup;
        if (leagues === undefined) return;
        return each(leagues, async league => {
            league.SportID = sport.ID;
            league.CountryID = "1";
            league.SportURL = sportURL.split("?")[0];
            return this.successor.processRequest(league).catch(err => {
                console.log('LeagueParser Error: ', err);
            });
        })
    }
}