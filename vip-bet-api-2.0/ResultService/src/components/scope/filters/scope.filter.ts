import { QueryBuilder, BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { toNumber } from 'lodash';
import { NormalizeOffset, NormalizeLimit } from "../../../../../CommonJS/src/utils/utils";
import { map } from "bluebird";
import { Scope } from "../models/scope.model";
import { IScope } from "../interfaces/scope.interface";

export class ScopeFilter {
    public id?: number;
    public ids?: number[];
    public name?: string;
    public name_exact?: boolean;
    public sport_id?: number;
    public page: number;
    public limit: number;
    constructor(data: Partial<ScopeFilter>) {
        this.id = data.id;
        this.ids = data.ids;
        this.name = data.name;
        this.name_exact = data.name_exact || false;
        this.sport_id = toNumber(data.sport_id);
        this.page = NormalizeOffset((data.page || 1) - 1);
        this.limit = NormalizeLimit(data.limit);
    }

    public async find(): Promise<IScope[]> {
        const query = QueryBuilder(Scope.tableName)
            .orderBy('order_id')
            .orderBy('id')
        if (this.id) query.where("id", this.id);
        if (this.ids) query.whereIn("id", this.ids);
        if (this.sport_id) query.where("sport_id", this.sport_id);
        if (this.name && !this.name_exact) query.where(QueryBuilder.raw(`name ilike ?`, [this.name].map(n => "%" + n + "%")));
        if (this.name && this.name_exact) query.where(QueryBuilder.raw(`name = ?`, [this.name]));
        const queryString = query.toString();
        const output = await BaseModel.db.manyOrNone(queryString);
        return map(output, async (c: any) => new Scope(c));
    }
}