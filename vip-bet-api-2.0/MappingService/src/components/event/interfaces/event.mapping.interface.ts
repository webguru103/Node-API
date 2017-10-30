import { IBase } from "../../../../../CommonJS/src/base/base.interface";

export interface IEventMapping extends IBase {
    id: number;
    provider_id: number;
    provider_event_id: string;
    start_date: Date;
    system_event_id?: number;
}