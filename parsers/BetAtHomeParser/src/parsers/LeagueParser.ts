/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { each } from "bluebird";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { IBetAtHomeEventGroup } from "../betAtHome";

export class LeagueParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(league: IBetAtHomeEventGroup) {
        const id: string = league.$.Id;
        const name: string = league.$.Name;
        const sportId: string = league.SportId;
        const countryId: string = league.CountryId;
        // add league
        await this.service.addCategory(id, CategoryType.LEAGUE, countryId, name, sportId);
        // get events
        const events = league.SportEvent;
        // if no events in league return
        if (!events) return;
        return each(events, async event => {
            // if parser stopped return
            if (ParserBase.stopped) return;
            event.SportId = sportId;
            event.CountryId = countryId;
            event.LeagueId = id;
            return this.successor.processRequest(event).catch(err => {
                console.log('EventParser Error: ');
                console.log(err);
            });
        })
    }
}