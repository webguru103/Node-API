import { IBase } from "../../../../../CommonJS/src/base/base.interface";

export interface IEventMarketMapping extends IBase {
    id: number;
    provider_id: number;
    provider_event_market_id: string;
    provider_market_id: string;
    provider_event_id: string;
    provider_sport_id: string;
    system_event_market_id?: number;
}