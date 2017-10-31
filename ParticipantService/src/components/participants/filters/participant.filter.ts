import { QueryBuilder, BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { DEFAULT_LANGUAGE } from "../../../../../CommonJS/src/domain/constant";
import { Participant } from "../models/participant.model";
import { IParticipant } from "../interfaces/participant.interface";
import { map } from "bluebird";

export class ParticipantFilter {
    public id?: number;
    public ids?: number[];
    public name?: string;
    public lang_id?: number;
    public sport_id?: number;

    constructor(data: Partial<ParticipantFilter>) {
        this.id = data.id;
        this.ids = data.ids;
        this.name = data.name;
        this.lang_id = data.lang_id || DEFAULT_LANGUAGE;
        this.sport_id = data.sport_id;
    }

    public async find(): Promise<IParticipant[]> {
        const query = QueryBuilder("participant as part").join("translations as tr", function () {
            this.on("part.dict_id", "tr.dict_id")
        })
            .orderBy("part.id")
            .select("part.id", "part.icon_url", "tr.translation as name");

        if (this.id) query.where("part.id", this.id)
        if (this.ids) query.whereIn("part.id", this.ids)
        if (this.sport_id) query.where("part.sport_id", this.sport_id)
        if (this.name) query.whereRaw(`tr.translation ILike '%${this.name}%'`)
        if (this.lang_id) query.where("tr.lang_id", this.lang_id)

        const queryString = query.toString();
        const output: any[] = await BaseModel.manyOrNone(queryString);
        return map(output, async p => new Participant(p));
    }
}