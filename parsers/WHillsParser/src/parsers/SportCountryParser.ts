/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { map } from "bluebird";
import { URLFactory } from "../utils/urlFactory";
import { HTTPUtil } from "../utils/httpUtil";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";

export class SportCountryParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(data) {
        let sportId: string = data['$'].category;
        let id: string = data['$'].id;
        let name: string = data['$'].name;

        if (sportId == "OTHER_SPORTS") {
            id = sportId + id;
            sportId = name;
        }

        await this.service.addCategory(sportId, CategoryType.SPORT, undefined, sportId);
        await this.service.addCategory(id, CategoryType.SPORT_COUNTRY, sportId, name);

        const reqObj = URLFactory.getRequest(`http://cachepricefeeds.williamhill.com/openbet_cdn?action=template&template=getHierarchyByMarketType&classId=` + id + "&filterBIR=N");
        const leaguesData = await HTTPUtil.scheduleGetData(reqObj);
        if (!leaguesData['williamhill']) return;
        const leagues = leaguesData['williamhill'][0].class[0].type;

        return map(leagues, async league => {
            if (ParserBase.stopped) return;
            league['sportId'] = sportId;
            league['countryId'] = id;
            return this.successor.processRequest(league).catch(err => {
                console.log('LeagueParser Error: ', err);
            });;
        }, { concurrency: 5 });
    }
}