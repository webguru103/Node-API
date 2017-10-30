/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { each } from "bluebird";
import { IBet365League } from "../utils/bet365.interface";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { isArray } from "lodash";

export class LeagueParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(league: IBet365League) {
        const id = league.$.ID;
        const name = league.$.Name || league.$.name;
        const sportId = league.SportID;
        const countryId = league.CountryID;
        // add league
        await this.service.addCategory(id, CategoryType.LEAGUE, countryId, name, sportId);
        // get events
        const events = league.Event;
        if (!isArray(events)) return;
        return each(events, async event => {
            event.SportID = sportId;
            event.CountryID = countryId;
            event.LeagueID = id;
            event.LeagueName = name;
            event.SportURL = league.SportURL;
            return this.successor.processRequest(event).catch(err => {
                console.log('EventParser Error: ');
                console.log(err);
            });
        })
    }
}