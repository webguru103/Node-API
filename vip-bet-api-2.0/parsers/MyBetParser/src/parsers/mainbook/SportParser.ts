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


export class SportParser extends ParserBase {
    private service: ICategoryService = new CategoryService();

    async processRequest(data) {
        let sports = data['sport'];
        await each(sports, async (sport) => {
            if (ParserBase.stopped) return;
            let id: string = sport['$'].id;
            let name: string = TranslationUtil.getTranslation(sport['$']['translation-id'], LanguageType.en);
            if (name) return this.service.addCategory(id, CategoryType.SPORT, undefined, name);
        })
        return this.successor.processRequest(data).catch(err => {
            console.log("SportCountryParser Error:");
            console.log(err);
        });
    }
}