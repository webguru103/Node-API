/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../../BaseParser/src/bll/services/CategoryService";
import { each } from "bluebird";
import { CategoryType } from "../../../../../CategoryService/src/components/category/enums/category_type.enum";

export class LeagueParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(data) {
        let leagues: any[] = data['event-group'];

        return each(leagues, async (league) => {
            if (ParserBase.stopped) return;
            let leagueId: string = league['$'].id;

            let leagueDb = await this.service.isCategory(leagueId, CategoryType.LEAGUE);
            if (!leagueDb) return;

            return this.successor.processRequest(league.event).catch(err => {
                console.log('EventParser Error: ');
                console.log(err);
            });
        });
    }
}