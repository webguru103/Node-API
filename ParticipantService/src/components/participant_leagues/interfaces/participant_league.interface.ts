import { IBase } from "../../../../../CommonJS/src/base/base.interface";

export interface IParticipantLeague extends IBase {
    league_id: number;
    participant_id: number;
    country_id: number;
}