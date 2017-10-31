import { QueryBuilder, BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { NormalizeOffset, NormalizeLimit } from "../../../../../CommonJS/src/utils/utils";
import { EventSelectionResult } from "../models/event_selection_result.model";
import { IEventSelectionResult } from "../interfaces/event_selection_result.interface";
import { map } from "bluebird";

export class EventSelectionResultFilter {
    public id?: number;
    public ids?: number[];
    public event_id?: number;
    public event_market_id?: number;
    public page: number;
    public limit: number;
    constructor(data: Partial<EventSelectionResultFilter>) {
        this.id = data.id;
        this.ids = data.ids;
        this.event_id = data.event_id;
        this.event_market_id = data.event_market_id;
        this.page = NormalizeOffset((data.page || 1) - 1);
        this.limit = NormalizeLimit(data.limit);
    }

    public async find(): Promise<IEventSelectionResult[]> {
        const query = QueryBuilder(EventSelectionResult.tableName)
        if (this.id) query.where("id", this.id);
        if (this.ids) query.whereIn("id", this.ids);
        if (this.event_id) query.where("event_id", this.event_id);
        if (this.event_market_id) query.where("event_market_id", this.event_market_id);
        const queryString = query.toString();
        const output = await BaseModel.db.manyOrNone(queryString);
        return map(output, async (es: any) => new EventSelectionResult(es));
    }
}