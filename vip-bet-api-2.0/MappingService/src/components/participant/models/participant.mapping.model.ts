import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { IParticipantMapping } from "../interfaces/participant.mapping.interface";

export class ParticipantMapping extends BaseModel implements IParticipantMapping {
    public static tableName: string = "participant_mapping";
    public id: number;
    public provider_id?: number;
    public provider_participant_id?: string;
    public provider_participant_name?: string;
    public provider_sport_id?: string;
    public provider_league_id?: string;
    public system_participant_id?: number | null;

    constructor(data: IParticipantMapping) {
        super();
        this.id = data.id;
        this.provider_id = data.provider_id;
        this.provider_league_id = data.provider_league_id;
        this.provider_participant_id = data.provider_participant_id;
        this.provider_participant_name = data.provider_participant_name;
        this.provider_sport_id = data.provider_sport_id;
        this.system_participant_id = data.system_participant_id;
    }
}