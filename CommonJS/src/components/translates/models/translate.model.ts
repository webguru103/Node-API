import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { Dictionary } from "./dictionary.model";

export class Translate extends BaseModel {
    public static tableName = "translations";
    public id?: number;
    public dict_id?: number;
    public lang_id?: number;
    public translation?: string;

    constructor(data: Partial<Translate>) {
        super();
        this.id = data.id;
        this.dict_id = data.dict_id;
        this.lang_id = data.lang_id;
        this.translation = data.translation;
    }

    public async saveWithID(): Promise<Translate> {
        let dictionary = new Dictionary(<any>{});
        await dictionary.saveWithID();
        this.dict_id = dictionary.id;
        return super.saveWithID();
    }

    public async delete(): Promise<any> {
        await super.delete();
        return Dictionary.delete(<any>Dictionary, { id: this.dict_id });
    }
}