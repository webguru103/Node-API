import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { IEventSelectionResult } from "../interfaces/event_selection_result.interface";
import { ResultType } from "../../../../../MarketService/src/components/selections/enums/result_type.enum";

export class EventSelectionResult extends BaseModel implements IEventSelectionResult {
    public static tableName = "event_selection_result";
    public id: number;
    public event_id: number;
    public event_market_id: number;
    public selection_id: number;
    public result_type_id: ResultType;

    constructor(data: IEventSelectionResult) {
        super();
        this.id = data.id;
        this.event_id = data.event_id;
        this.event_market_id = data.event_market_id;
        this.selection_id = data.selection_id;
        this.result_type_id = data.result_type_id;
    }
}