import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { DEFAULT_LANGUAGE } from "../../../../../CommonJS/src/domain/constant";
import { Translate } from "../../../../../CommonJS/src/components/translates/models/translate.model";
import { map } from "bluebird";
import { IParticipant } from "../interfaces/participant.interface";

export class Participant extends BaseModel implements IParticipant {
    public static tableName = "participant";
    public id: number;
    public name?: string;
    public dict_id: number;
    public sport_id: number;
    public lang_id?: number;
    public icon_url: string;

    constructor(data: IParticipant) {
        super();
        this.id = data.id;
        this.name = data.name;
        this.dict_id = data.dict_id;
        this.sport_id = data.sport_id;
        this.lang_id = data.lang_id || DEFAULT_LANGUAGE;
        this.icon_url = data.icon_url;
    }

    public async saveWithID(): Promise<IParticipant> {
        const translate = new Translate(<any>{ lang_id: this.lang_id, translation: this.name });
        await translate.saveWithID();

        const langId = this.lang_id;
        delete this.lang_id;
        if (langId != DEFAULT_LANGUAGE) delete this.name;
        this.dict_id = <number>translate.dict_id;

        await super.saveWithID();

        this.lang_id = langId;
        this.name = translate.translation;
        return this;
    }

    public static async findOne(data: any): Promise<IParticipant | undefined> {
        const participant = await super.findOne(<any>Participant, { id: data.id });
        if (!participant) return;
        const translate: Translate = await Translate.findOne(<any>Translate, { dict_id: participant.dict_id, lang_id: data.lang_id || DEFAULT_LANGUAGE });
        participant.name = translate.translation;
        return new Participant(participant);
    }

    public static async search(data: Participant): Promise<IParticipant | undefined> {
        return await super.findOne(<any>Participant, { sport_id: data.sport_id, name: data.name });
    }

    public async update(data: any = this, byFields: any = { id: this.id }): Promise<IParticipant> {
        this.icon_url = data.icon_url || this.icon_url;
        this.name = data.name || this.name;

        const langId = this.lang_id;
        const dict_id = this.dict_id;
        const name = data.name || this.name;

        delete this.lang_id;
        delete this.dict_id;
        delete this.name;

        await super.update();

        this.dict_id = dict_id;
        this.name = name;
        this.lang_id = langId;

        await Translate.update(<any>Translate, { translation: this.name }, { dict_id: this.dict_id, lang_id: this.lang_id });
        return this;
    }

    public static async getParticipantsBySportId(sportId: number, langId: number = DEFAULT_LANGUAGE): Promise<IParticipant[]> {
        const query = `select part.id, part.sport_id, COALESCE (tr2.translation, tr.translation) as name, part.icon_url from participant as part
                       join translations as tr on tr.dict_id = part.dict_id
                       left join translations as tr2 on tr2.dict_id=tr.dict_id and tr2.lang_id=$1
                       where tr.lang_id = 1
                       and part.sport_id = $2
                       order by part.id`;
        const output: any[] = await BaseModel.manyOrNone(query, [langId, sportId]);
        return map(output, c => new Participant(c));
    }
}