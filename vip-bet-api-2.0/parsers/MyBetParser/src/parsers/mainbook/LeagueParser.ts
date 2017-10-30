/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../../BaseParser/src/bll/services/CategoryService";
import { TranslationUtil } from "../../utils/TranslationUtil";
import { LanguageType } from "../../utils/LanguageType";
import { each } from "bluebird";
import { CategoryType } from "../../../../../CategoryService/src/components/category/enums/category_type.enum";

export class LeagueParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(data) {
        let leagues: any[] = data['event-group'];
        let countries = ParserBase.countries;
        return each(leagues, async (league) => {
            if (ParserBase.stopped) return;
            let leagueId: string = league['$'].id;
            let leagueName: string = TranslationUtil.getTranslation(league['$']['translation-id'], LanguageType.en);
            if (!leagueName) return;

            let sportId: string = league['$']['sport-id'];
            let country: any = countries[league['$']['region-id']];
            let countryId: string = country.id + '00000' + sportId;
            if (!country.name) return;

            await this.service.addCategory(countryId, CategoryType.SPORT_COUNTRY, sportId, country.name);
            await this.service.addCategory(leagueId, CategoryType.LEAGUE, countryId, leagueName, sportId);

            if (!league.event) return;
            return this.successor.processRequest({
                'betting-program': data,
                events: league.event,
                sportId: sportId,
                countryId: countryId,
                leagueId: leagueId
            }).catch(err => {
                console.log("EventParser Error:");
                console.log(err);
            });
        });
    }
}