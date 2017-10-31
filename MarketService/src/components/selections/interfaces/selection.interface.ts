import { IBase } from "../../../../../CommonJS/src/base/base.interface";

export interface ISelectionModel extends IBase {
    id: number,
    name: string
    dict_id: number,
    market_id: number,
    row_index: number,
    column_index: number,
    lang_id?: number;
    rule: string;
    cancel_rule: string;
}