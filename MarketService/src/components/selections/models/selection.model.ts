import { ISelectionModel } from "../interfaces/selection.interface";
import { BaseModel } from "../../../../../CommonJS/src/base/base.model";

export class SelectionModel extends BaseModel implements ISelectionModel {
    public static tableName = 'market_selection';
    public id: number;
    public name: string;
    public dict_id: number;
    public market_id: number;
    public row_index: number;
    public column_index: number;
    public rule: string;
    public cancel_rule: string;

    constructor(data: ISelectionModel) {
        super();
        this.id = data.id;
        this.name = data.name;
        this.dict_id = data.dict_id;
        this.market_id = data.market_id;
        this.row_index = data.row_index;
        this.column_index = data.column_index;
        this.rule = data.rule;
        this.cancel_rule = data.cancel_rule;
    }

    async saveWithID(conflictRule?: string): Promise<this> {
        let query: string;
        query = `insert into market_selection (dict_id, market_id, row_index, column_index, name, rule, cancel_rule) 
                        values ($1, $2, $3, $4, $5, $6, $7)
                        on conflict (market_id, name) do update set market_id = $2, name = $5 returning *;`;

        if (this.row_index === undefined) {
            query = `insert into market_selection(dict_id, market_id, row_index, column_index, name, rule, cancel_rule) 
            values ($1, $2, (select coalesce(max(row_index)+1,1) from market_selection where market_id=$2 and column_index=1), $4, $5, $6, $7) 
            on conflict (market_id, name) do update set market_id = $2, name = $5 returning *;`
        }
        const selection = await BaseModel.db.one(query, [
            this.dict_id, this.market_id, this.row_index,
            this.column_index, this.name, this.rule, this.cancel_rule]);
        this.id = selection.id;
        this.row_index = selection.row_index;
        return this;
    }
}