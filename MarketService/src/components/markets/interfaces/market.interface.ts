import { ISelectionModel } from "../../selections/interfaces/selection.interface";
import { MarketStatus } from "../enums/market_status.enum";

export interface IMarket{
    id: number,
    name: string,
    dict_id: number,
    is_tipster?: boolean,
    is_tipster_default?: boolean,
    category_id?: number,
    order_id?: number,
    status_id?: MarketStatus,
    multi_winner?: boolean,
    scope_id?: number,
    statistic_type_id?: number
}

export interface IMarketPublic extends IMarket {
    lang_id: number,
    selections: ISelectionModel[]
}