import { ISelectionModel } from "../interfaces/selection.interface";
import { QueryBuilder, BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { Translate } from "../../../../../CommonJS/src/components/translates/models/translate.model";
import { DEFAULT_LANGUAGE } from "../../../../../CommonJS/src/domain/constant";
import { SelectionModel } from "../models/selection.model";
import { map } from "bluebird";

export class SelectionFilter {
    public id?: number;
    public ids?: number[];
    public market_id?: number;
    public name?: string;
    public lang_id: number;

    constructor(data: Partial<SelectionFilter>) {
        this.id = data.id;
        this.ids = data.ids;
        this.market_id = data.market_id;
        this.lang_id = data.lang_id || DEFAULT_LANGUAGE;
        this.name = data.name;
    }

    public async find(): Promise<ISelectionModel[]> {
        const query = QueryBuilder(SelectionModel.tableName)
            .join(Translate.tableName + " as tr", "tr.dict_id", "=", SelectionModel.tableName + ".dict_id")
            .leftJoin(Translate.tableName + " as tr2", QueryBuilder.raw(`tr2.dict_id = tr.dict_id and tr2.lang_id = ${this.lang_id}`))
            .where("tr.lang_id", "=", DEFAULT_LANGUAGE)
            .orderBy(SelectionModel.tableName + '.column_index')
            .orderBy(SelectionModel.tableName + '.row_index')
            .select(SelectionModel.tableName + '.*')
            .select(QueryBuilder.raw('coalesce(tr2.translation, tr.translation) as name'))
            .select(QueryBuilder.raw('coalesce(tr2.lang_id, tr.lang_id) as lang_id'));

        if (this.id) query.where(`${SelectionModel.tableName}.id`, this.id);
        if (this.ids) query.whereIn(`${SelectionModel.tableName}.id`, this.ids);
        if (this.name) query.whereRaw(QueryBuilder.raw(`lower(${SelectionModel.tableName}.name = '${this.name}'`))
        if (this.market_id) query.where(`${SelectionModel.tableName}.market_id`, this.market_id);
        // execute query
        const queryString = query.toString();
        const output = <ISelectionModel[]>await BaseModel.db.manyOrNone(queryString);
        // return selections
        return map(output, async selection => new SelectionModel(selection));
    }
}