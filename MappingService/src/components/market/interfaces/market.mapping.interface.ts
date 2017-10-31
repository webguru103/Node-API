import { IBase } from "../../../../../CommonJS/src/base/base.interface";

export interface IMarketMapping extends IBase {
    id: number;
    provider_id: number;
    provider_market_id: string;
    provider_market_name: string;
    provider_category_id: string;
    system_market_id?: number;
}