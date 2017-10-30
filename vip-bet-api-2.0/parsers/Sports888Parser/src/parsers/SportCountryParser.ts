/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";

export class SportCountryParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(event) {
        if (!event.path || event.path.length < 2) return;
        // get sport id
        let sportId: string = event.sportId;
        // grab details of country
        let country = Object.assign({}, event.path[1]);
        //if there is no country
        if (event.path.length == 2) {
            country.id = sportId + "." + country.id;
        }
        // add sport country
        await this.service.addCategory(country.id, CategoryType.SPORT_COUNTRY, sportId, country.name);
        // send data to next successor
        event["countryId"] = country.id;
        return this.successor.processRequest(event);
    }
}