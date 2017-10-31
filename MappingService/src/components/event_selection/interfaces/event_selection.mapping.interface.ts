import { IBase } from "../../../../../CommonJS/src/base/base.interface";

export interface IEventSelectionMapping extends IBase {
    id: number;
    provider_id: number;
    provider_event_selection_id: string;
    provider_event_market_id: string;
    provider_sport_id: string;
    provider_market_id: string;
    provider_selection_id: string;
    system_event_selection_id: number;
    argument: string
}