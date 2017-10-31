import { IParticipantMapping } from "../interfaces/participant.mapping.interface";
import { QueryBuilder, BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { ParticipantMapping } from "../models/participant.mapping.model";

export class ParticipantMappingFilter {
    public id?: number;
    public ids?: number[];
    public provider_id?: number;
    public provider_participant_id?: string;
    public provider_participant_name?: string;
    public provider_sport_id?: string;
    public provider_league_id?: string;
    public system_participant_id?: number;

    constructor(filter: Partial<ParticipantMappingFilter>) {
        this.id = filter.id;
        this.ids = filter.ids;
        this.provider_id = filter.provider_id;
        this.provider_league_id = filter.provider_league_id;
        this.provider_participant_id = filter.provider_participant_id;
        this.provider_participant_name = filter.provider_participant_name;
        this.provider_sport_id = filter.provider_sport_id;
        this.system_participant_id = filter.system_participant_id;
    }

    async find(): Promise<IParticipantMapping[]> {
        const query = QueryBuilder(ParticipantMapping.tableName)
        if (this.id) query.where("id", this.id);
        if (this.ids) query.whereIn("id", this.ids);
        if (this.provider_id) query.where("provider_id", this.provider_id);
        if (this.provider_league_id) query.where("provider_league_id", this.provider_league_id);
        if (this.provider_participant_id) query.where("provider_participant_id", this.provider_participant_id);
        if (this.provider_participant_name) query.where("provider_participant_name", this.provider_participant_name);
        if (this.provider_sport_id) query.where("provider_sport_id", this.provider_sport_id);
        if (this.system_participant_id) query.where("system_participant_id", this.system_participant_id);

        const result = await BaseModel.manyOrNone(query.toString());
        return result.map(m => new ParticipantMapping(m));
    }
}