/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { each } from "bluebird";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { IBetAtHomeSport } from "../betAtHome";

export class SportParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(sport: IBetAtHomeSport) {
        // if sport not found return
        if (!sport) return;
        // add sport            
        await this.service.addCategory(sport.$.Id, CategoryType.SPORT, undefined, sport.$.Name);
        const countries = sport.Region;
        // if there is no country return
        if (!countries) return;
        return each(countries, async country => {
            // if parser stopped return
            if (ParserBase.stopped) return;
            // set sport id
            country.SportId = sport.$.Id;
            return this.successor.processRequest(country).catch(err => {
                console.log('SportCountryParser Error: ', err);
            });
        })
    }
}