/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { each } from "bluebird";
import { IRKLeague } from "../utils/redkings";

export class LeagueParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(data: IRKLeague) {
        const name = data['$'].name.replace(/([0-9]{4,4}\/[0-9]{4,4}|[0-9]{4,4})/g, "");
        const sportId = data.SportId;
        const countryId = data.CountryId;
        const id = data.CountryId + "." + data['$'].id;
        // add league
        await this.service.addCategory(id, CategoryType.LEAGUE, countryId, name, sportId);
        // if no events return
        if (!data.Match) return;
        // process events
        return each(data.Match, async event => {
            if (ParserBase.stopped) return;
            event.SportId = sportId;
            event.CountryId = countryId;
            event.LeagueId = id;
            return this.successor.processRequest(event).catch(err => {
                console.log('EventParser Error: ');
                console.log(err);
            });
        });
    }
}