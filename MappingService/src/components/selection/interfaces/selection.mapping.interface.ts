import { IBase } from "../../../../../CommonJS/src/base/base.interface";

export interface ISelectionMapping extends IBase {
    id: number;
    provider_id: number;
    provider_selection_id: string;
    provider_selection_name: string;
    provider_market_id: string;
    provider_category_id: string;
    system_selection_id?: number;
}