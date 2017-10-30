/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { each } from "bluebird";
import { isArray } from "lodash";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { IClass, Ladbrokes } from "../utils/ladbrokes";

export class SportParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(data: IClass) {
        const id: string = data.classKey.toString();
        const name: string = isArray(data.links) ? data.links[0].link.title : data.links.link.title;
        // get sport with events
        const sportWithEvents = await Ladbrokes.GetClassEvents(data.classKey);
        // is response empty return
        if (!sportWithEvents || !sportWithEvents.classes) return;
        const sport = sportWithEvents.classes.class as IClass;
        // country
        const countries = isArray(sport.types.type) ? sport.types.type : [sport.types.type];
        // add sport
        await this.service.addCategory(id, CategoryType.SPORT, undefined, name);
        // process countries
        return each(countries, async country => {
            if (ParserBase.stopped) return;
            country.classKey = sport.classKey;
            return this.successor.processRequest(country).catch(err => {
                console.log('SportCountryParser Error: ', err);
            });
        });
    }
}