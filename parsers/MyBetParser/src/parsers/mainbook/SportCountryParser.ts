/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../../BaseParser/src/ParserBase";
import { TranslationUtil } from "../../utils/TranslationUtil";
import { LanguageType } from "../../utils/LanguageType";
import { each } from "bluebird";

export class SportCountryParser extends ParserBase {
    async processRequest(data) {
        let countries = ParserBase.countries;
        let countriesToParse = data['region'];
        await each(countriesToParse, country => {
            if (ParserBase.stopped) return;
            let id: number = country['$'].id;
            let name: string = TranslationUtil.getTranslation(country['$']['translation-id'], LanguageType.en);
            if (name) countries[id] = { id: id, name: name };
        })
        return this.successor.processRequest(data).catch(err => {
            console.log("LeagueParser Error:");
            console.log(err);
        });
    }
}