/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { each } from "bluebird";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";

export class LeagueParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(data) {
        const id: string = data['$'].id;
        const name: string = data['$'].name;
        const sportId: string = data.sportId;
        const countryId: string = data.countryId;

        await this.service.addCategory(id, CategoryType.LEAGUE, countryId, name, sportId);
        const events = data['market'];
        if (!events) return;

        return each(events, async event => {
            if (ParserBase.stopped) return;
            event['sportId'] = sportId;
            event['countryId'] = countryId;
            event['leagueId'] = id;
            return this.successor.processRequest(event).catch(err => {
                console.log('EventParser Error: ');
                console.log(err);
            });
        });
    }
}