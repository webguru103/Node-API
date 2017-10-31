/**
 * Created by   on 3/1/2017.
 */
import { Translate } from "../models/translate.model";

export class TranslationService {
    async addTranslation(translation: any): Promise<Translate> {
        let translate = new Translate(translation);
        return translate.saveWithID();
    }

    async updateTranslation(translation: any): Promise<Translate> {
        return Translate.update(<any>translation, translation);
    }

    async deleteTranslation(translation: any): Promise<any> {
        let translate = new Translate(translation);
        return translate.delete();
    }

    async getTranslation(translation: any): Promise<Translate> {
        let translate = <Translate>await Translate.findOne(<any>Translate, translation);
        return translate.findOne(translate);
    }
}