/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { HTTPUtil } from "../utils/httpUtil";
import { map } from "bluebird";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { IRKSport } from "../utils/redkings";

export class SportParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(sportName) {
        let data = await HTTPUtil.scheduleGetData("http://aws2.betredkings.com/feed/" + sportName);
        const sport: IRKSport = data[sportName.split('.xml')[0]]['Sport'][0];
        const id = sport.$.id;
        const name = sport.$.name;
        const countries = sport.Country;
        await this.service.addCategory(id, CategoryType.SPORT, undefined, name);
        return map(countries, async country => {
            if (ParserBase.stopped) return;
            country.SportId = id;
            return this.successor.processRequest(country).catch(err => {
                console.log('SportCountryParser Error: ', err);
            });
        });
    }
}