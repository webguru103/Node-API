import { Provider } from "../models/provider.model";
import { QueryBuilder, BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { NormalizeLimit, NormalizeOffset } from "../../../../../CommonJS/src/utils/utils";

export class ProviderFilter {
    public page: number;
    public limit: number;
    public status_id?: number;
    public id?: number;
    public ids?: number[];
    public name?: string;

    constructor(filter: Partial<ProviderFilter>) {
        this.page = filter.page || 1;
        this.limit = filter.limit || 100;
        this.status_id = filter.status_id;
        this.id = filter.id;
        this.ids = filter.ids;
        this.name = filter.name;
    }

    public async find(): Promise<Provider[] | any[]> {
        const query = QueryBuilder.table(Provider.tableName)
            .orderBy('order_id', 'asc')
            .select('*')
            .limit(NormalizeLimit(this.limit))
            .offset(NormalizeOffset(this.page - 1) * NormalizeLimit(this.limit));

        if (this.id) query.where("id", this.id);
        if (this.ids) query.whereIn("id", this.ids);
        if (this.status_id) query.where("status_id", this.status_id);
        if (this.name) query.whereRaw(QueryBuilder.raw(`name ilike '${this.name}`));

        const queryString = query.toString();
        const result = await BaseModel.db.manyOrNone(queryString);
        return result.map(r => new Provider(r));
    }
}