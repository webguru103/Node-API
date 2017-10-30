import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { IMarketMapping } from "../interfaces/market.mapping.interface";

export class MarketMapping extends BaseModel implements IMarketMapping {
    public static tableName: string = "market_mapping";
    public id: number;
    public provider_id: number;
    public provider_market_id: string;
    public provider_market_name: string;
    public provider_category_id: string;
    public system_market_id?: number;

    constructor(data: IMarketMapping) {
        super();
        this.id = data.id;
        this.provider_category_id = data.provider_category_id;
        this.provider_id = data.provider_id;
        this.provider_market_id = data.provider_market_id;
        this.provider_market_name = data.provider_market_name;
        this.system_market_id = data.system_market_id;
    }
}