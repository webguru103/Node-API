import { QueryBuilder, BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { toNumber } from 'lodash';
import { NormalizeOffset, NormalizeLimit } from "../../../../../CommonJS/src/utils/utils";
import { map } from "bluebird";
import { IStatisticType } from "../interfaces/statistic_type.interface";
import { StatisticType } from "../models/statistic_type.model";

export class StatisticTypeFilter {
    public id?: number;
    public ids?: number[];
    public name?: string;
    public name_exact: boolean;
    public sport_id?: number;
    public page: number;
    public limit: number;
    constructor(data: Partial<StatisticTypeFilter>) {
        this.id = data.id;
        this.ids = data.ids;
        this.name = data.name;
        this.name_exact = data.name_exact || false;
        this.sport_id = toNumber(data.sport_id);
        this.page = NormalizeOffset((data.page || 1) - 1);
        this.limit = NormalizeLimit(data.limit);
    }

    public async find(): Promise<IStatisticType[]> {
        const query = QueryBuilder(StatisticType.tableName)
            .orderBy('order_id')
            .orderBy('id')
        if (this.id) query.where("id", this.id);
        if (this.ids) query.whereIn("id", this.ids);
        if (this.sport_id) query.where("sport_id", this.sport_id);
        if (this.name && !this.name_exact) query.where(QueryBuilder.raw(`name ilike ?`, [this.name].map(n => "%" + n + "%")));
        if (this.name && this.name_exact) query.where(QueryBuilder.raw(`name = ?`, [this.name]));
        const queryString = query.toString();
        const output = await BaseModel.db.manyOrNone(queryString);
        return map(output, async (c: any) => new StatisticType(c));
    }
}