import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { IEventMarketMapping } from "../interfaces/event_market.mapping.interface";

export class EventMarketMapping extends BaseModel implements IEventMarketMapping {
    public static tableName: string = "event_market_mapping";
    public id: number;
    public provider_id: number;
    public provider_event_market_id: string;
    public provider_market_id: string;
    public provider_event_id: string;
    public provider_sport_id: string;
    public system_event_market_id?: number;

    constructor(data: IEventMarketMapping) {
        super();
        this.id = data.id;
        this.provider_id = data.provider_id;
        this.provider_event_id = data.provider_event_id;
        this.provider_event_market_id = data.provider_event_market_id;
        this.provider_market_id = data.provider_market_id;
        this.provider_sport_id = data.provider_sport_id;
        this.system_event_market_id = data.system_event_market_id;
    }
}