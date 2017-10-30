/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";

export class LeagueParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(event) {
        let league = event.path[event.path.length - 1];
        let id: string = league.id;
        let name: string = league.name;
        let sportId: string = event.sportId;
        let countryId: string = event.countryId;

        await this.service.addCategory(id, CategoryType.LEAGUE, countryId, name, sportId);

        event['leagueId'] = id;
        return this.successor.processRequest(event).catch(err => {
            console.log('EventParser Error: ');
            console.log(err);
        });
    }
}