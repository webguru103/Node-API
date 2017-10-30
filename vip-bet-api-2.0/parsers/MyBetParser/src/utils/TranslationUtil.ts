/**
 * Created by   on 4/5/2017.
 */
import { LanguageType } from "./LanguageType";
import { URLFactory } from "./urlFactory";
import { HTTPUtil } from "./httpUtil";
import { map } from "bluebird";

export class TranslationUtil {
    private static translations: any = {};

    static async loadTranslation(lang: LanguageType) {
        let reqObj = URLFactory.getRequest("https://b2bproxy.mybet.com/b2b-api/v2/rest/betting-program/main/translations/" + LanguageType[lang]);

        let data = await HTTPUtil.scheduleGetData(reqObj);
        if (!data) return this.translations[lang];
        if (!this.translations[lang]) this.translations[lang] = {};

        let elements: any[] = data['betting-program-translations']['translation'];
        return map(elements, async (element) => {
            let value = element['_'];
            if (!this.translations[lang][element['$']['id']]) this.translations[lang][element['$']['id']] = value;
            return value;
        });
    }

    static getTranslation(translationId: string, lang: LanguageType) {
        if (!this.translations[lang]) return undefined;
        return this.translations[lang][translationId];
    }

    static destroyTranslations() {
        this.translations = {};
    }
}