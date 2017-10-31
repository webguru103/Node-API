import { IBase } from "../../../../../CommonJS/src/base/base.interface";

export interface IParticipantMapping extends IBase {
    id: number;
    provider_id?: number;
    provider_participant_id?: string;
    provider_participant_name?: string;
    provider_sport_id?: string;
    provider_league_id?: string;
    system_participant_id?: number | null;
}