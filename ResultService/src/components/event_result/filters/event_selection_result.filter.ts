import { QueryBuilder, BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { NormalizeOffset, NormalizeLimit } from "../../../../../CommonJS/src/utils/utils";
import { map } from "bluebird";
import { EventResult } from "../models/event_result.model";
import { IEventResult } from "../interfaces/event_result.interface";

export class EventResultFilter {
    public id?: number;
    public ids?: number[];
    public page: number;
    public limit: number;
    constructor(data: Partial<EventResultFilter>) {
        this.id = data.id;
        this.ids = data.ids;
        this.page = NormalizeOffset((data.page || 1) - 1);
        this.limit = NormalizeLimit(data.limit);
    }

    public async find(): Promise<IEventResult[]> {
        const query = QueryBuilder(EventResult.tableName)
        if (this.id) query.where("id", this.id);
        if (this.ids) query.whereIn("id", this.ids);
        const queryString = query.toString();
        const output = await BaseModel.db.manyOrNone(queryString);
        return map(output, async (es: any) => new EventResult(es));
    }
}