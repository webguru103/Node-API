import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { IParticipantLeague } from "../interfaces/participant_league.interface";

export class ParticipantLeague extends BaseModel implements IParticipantLeague {
    public static tableName = "league_participant";
    public league_id: number;
    public participant_id: number;
    public country_id: number;

    constructor(data: IParticipantLeague) {
        super();
        this.league_id = data.league_id;
        this.country_id = data.country_id;
        this.participant_id = data.participant_id;
    }
}