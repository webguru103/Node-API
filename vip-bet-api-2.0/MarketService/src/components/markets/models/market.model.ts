import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { IMarket, IMarketPublic } from "../interfaces/market.interface";
import { ISelectionModel } from "../../selections/interfaces/selection.interface";
import { MarketStatus } from "../enums/market_status.enum";

export class Market extends BaseModel implements IMarket {
    public static tableName = "market";
    public id: number;
    public name: string;
    public dict_id: number;
    public is_tipster?: boolean;
    public is_tipster_default?: boolean;
    public category_id?: number;
    public order_id?: number;
    public status_id?: MarketStatus;
    public multi_winner?: boolean;
    public scope_id: number;
    public statistic_type_id: number;

    constructor(data: IMarket) {
        super();
        this.id = data.id;
        this.name = data.name;
        this.dict_id = data.dict_id;
        this.is_tipster = data.is_tipster;
        this.is_tipster_default = data.is_tipster_default;
        this.category_id = data.category_id;
        this.order_id = data.order_id
        this.status_id = data.status_id;
        this.multi_winner = data.multi_winner;
        this.scope_id = data.scope_id;
        this.statistic_type_id = data.statistic_type_id;
    }
}

export class MarketPublic implements IMarketPublic {
    public id: number;
    public dict_id: number;
    public is_tipster?: boolean;
    public is_tipster_default?: boolean;
    public category_id?: number;
    public order_id?: number;
    public status_id?: MarketStatus;
    public name: string;
    public lang_id: number;
    public selections: ISelectionModel[];
    public multi_winner?: boolean;
    public scope_id: number;
    public statistic_type_id: number;

    constructor(data: IMarketPublic) {
        this.id = data.id;
        this.dict_id = data.dict_id;
        this.is_tipster = data.is_tipster;
        this.is_tipster_default = data.is_tipster_default;
        this.category_id = data.category_id;
        this.order_id = data.order_id
        this.status_id = data.status_id;
        this.name = data.name;
        this.lang_id = data.lang_id;
        this.selections = data.selections;
        this.multi_winner = data.multi_winner;
        this.scope_id = data.scope_id;
        this.statistic_type_id = data.statistic_type_id;
    }
}