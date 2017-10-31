/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { CategoryType } from "../../../../CommonJS/src/domain/enums/category.type";
import { each } from "bluebird";
import { IBet365League } from "../utils/bet365.interface";

export class LeagueParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(league: IBet365League) {
        const id: string = league.ID;
        const name: string = league.Name || league.name;
        const sportId: string = league.SportID;
        const countryId: string = league.CountryID;

        await this.service.addCategory(id, CategoryType.LEAGUE, countryId, name, sportId);

        const events = league.Event;
        if (events === undefined) return;
        return each(events, async event => {
            event.SportID = sportId;
            event.CountryID = countryId;
            event.LeagueID = id;
            event.LeagueName = name;
            event.SportURL = league.SportURL;
            Object.assign(event, event['$']);
            return this.successor.processRequest(event).catch(err => {
                console.log('EventParser Error: ');
                console.log(err);
            });
        })
    }
}