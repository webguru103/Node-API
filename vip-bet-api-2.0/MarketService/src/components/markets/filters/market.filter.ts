import { IMarket, IMarketPublic } from "../interfaces/market.interface";
import { QueryBuilder, BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { Market, MarketPublic } from "../models/market.model";
import { Translate } from "../../../../../CommonJS/src/components/translates/models/translate.model";
import { DEFAULT_LANGUAGE } from "../../../../../CommonJS/src/domain/constant";
import { map } from "bluebird";
import { SelectionService } from "../../selections/services/selection.service";
import { isString, uniq } from "lodash";
import { MarketStatus } from "../enums/market_status.enum";

export class MarketFilter {
    public id?: number;
    public ids?: number[];
    public name?: string;
    public lang_id?: number;
    public is_tipster?: boolean;
    public is_tipster_default?: boolean;
    public status_id?: MarketStatus;
    public include_selections?: boolean;
    public category_id: number;
    public scope_id?: number;
    public statistic_type_id?: number;
    private selectionService = new SelectionService();

    constructor(data: Partial<MarketFilter>) {
        this.id = data.id;
        this.ids = data.ids;
        // remove duplicates
        if (this.ids) this.ids = uniq(this.ids);
        this.name = data.name;
        this.lang_id = data.lang_id || DEFAULT_LANGUAGE;
        this.is_tipster = data.is_tipster;
        this.is_tipster_default = data.is_tipster_default;
        this.status_id = data.status_id;
        this.category_id = data.category_id;
        this.include_selections = data.include_selections === undefined ? true : data.include_selections;
        if (isString(this.include_selections)) this.include_selections = JSON.parse(this.include_selections);
        this.scope_id = data.scope_id;
        this.statistic_type_id = data.statistic_type_id;
    }

    public async find(): Promise<IMarketPublic[]> {
        const query = QueryBuilder(Market.tableName)
            .join(Translate.tableName + " as tr", "tr.dict_id", Market.tableName + ".dict_id")
            .leftJoin(Translate.tableName + " as tr2", QueryBuilder.raw(`tr2.dict_id = tr.dict_id and tr2.lang_id = ${this.lang_id}`))
            .where("tr.lang_id", DEFAULT_LANGUAGE)
            .orderBy(Market.tableName + '.order_id')
            .select(Market.tableName + '.*')
            .select(QueryBuilder.raw('coalesce(tr2.translation, tr.translation) as name'))
            .select("tr.lang_id")
        if (this.id) query.where(Market.tableName + ".id", this.id);
        if (this.ids) query.whereIn(Market.tableName + ".id", this.ids);
        if (this.category_id) query.where(Market.tableName + ".category_id", this.category_id);
        if (this.is_tipster !== undefined) query.where(Market.tableName + ".is_tipster", this.is_tipster);
        if (this.is_tipster_default !== undefined) query.where(Market.tableName + ".is_tipster_default", this.is_tipster_default);
        if (this.status_id) query.where(Market.tableName + ".status_id", this.status_id);
        if (this.scope_id) query.where(Market.tableName + ".scope_id", this.scope_id);
        if (this.statistic_type_id) query.where(Market.tableName + ".statistic_type_id", this.statistic_type_id);
        if (this.name) query.where(QueryBuilder.raw("(tr2.translation ilike '%" + this.name + "%' or tr.translation ilike '%" + this.name + "%')"));
        // execute query
        const queryString = query.toString();
        const output = <IMarketPublic[]>await BaseModel.db.manyOrNone(queryString);
        // return markets
        return map(output, async market => {
            if (this.include_selections) {
                // get selections
                const selections = await this.selectionService.list({ market_id: market.id, lang_id: market.lang_id });
                // set selections
                market.selections = selections;
            }
            // return market
            return market;
        })
    }
}