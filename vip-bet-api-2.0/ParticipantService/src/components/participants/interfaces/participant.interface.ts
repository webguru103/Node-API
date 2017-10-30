import { IBase } from "../../../../../CommonJS/src/base/base.interface";

export interface IParticipant extends IBase {
    id: number;
    name?: string;
    dict_id: number;
    sport_id: number;
    lang_id?: number;
    icon_url: string;
}