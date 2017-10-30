import { ResultType } from "../../../../../MarketService/src/components/selections/enums/result_type.enum";
import { IBase } from "../../../../../CommonJS/src/base/base.interface";

export interface IEventSelectionResult extends IBase {
    id: number;
    selection_id: number;
    event_id: number;
    event_market_id: number;
    result_type_id: ResultType;
}