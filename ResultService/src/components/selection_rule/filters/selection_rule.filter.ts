import { QueryBuilder, BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { NormalizeOffset, NormalizeLimit } from "../../../../../CommonJS/src/utils/utils";
import { map } from "bluebird";
import { ISelectionRule } from "../interfaces/selection_rule.interface";
import { SelectionRule } from "../models/selection_rule.model";

export class SelectionRuleFilter {
    public id?: number;
    public ids?: number[];
    public market_id?: number;
    public selection_id?: number;
    public rule?: string;
    public cancel_rule?: string;
    public page: number;
    public limit: number;
    constructor(data: Partial<SelectionRuleFilter>) {
        this.id = data.id;
        this.ids = data.ids;
        this.market_id = data.market_id;
        this.rule = data.rule;
        this.cancel_rule = data.cancel_rule;
        this.page = NormalizeOffset((data.page || 1) - 1);
        this.limit = NormalizeLimit(data.limit);
    }

    public async find(): Promise<ISelectionRule[]> {
        const query = QueryBuilder(SelectionRule.tableName).orderBy('id')
        if (this.id) query.where("id", this.id);
        if (this.ids) query.whereIn("id", this.ids);
        if (this.market_id) query.where("market_id", this.market_id);
        if (this.rule) query.where(QueryBuilder.raw(`rule ilike ?`, [this.rule].map(n => "%" + n + "%")));
        if (this.cancel_rule) query.where(QueryBuilder.raw(`cancel_rule ilike ?`, [this.cancel_rule].map(n => "%" + n + "%")));
        const queryString = query.toString();
        const output = await BaseModel.db.manyOrNone(queryString);
        return map(output, async (c: any) => new SelectionRule(c));
    }
}