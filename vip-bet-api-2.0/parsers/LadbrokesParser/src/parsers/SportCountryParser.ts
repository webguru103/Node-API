/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { each } from "bluebird";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { IType } from "../utils/ladbrokes";
import { isArray } from "lodash";

export class SportCountryParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(data: IType) {
        const id: string = data.typeKey.toString();
        const name: string = data.typeName;
        const sportId: string = data.classKey.toString();
        // add league
        await this.service.addCategory(id, CategoryType.SPORT_COUNTRY, sportId, name);
        // if league(s) missing
        if (!data.subtypes || !data.subtypes.subtype) return;
        // get leagues
        const leagues = isArray(data.subtypes.subtype) ? data.subtypes.subtype : [data.subtypes.subtype];
        // process leagues
        return each(leagues, async league => {
            if (ParserBase.stopped) return;
            league.classKey = data.classKey;
            league.typeKey = data.typeKey;
            return this.successor.processRequest(league).catch(err => {
                console.log('LeagueParser Error: ', err);
            });
        });
    }
}