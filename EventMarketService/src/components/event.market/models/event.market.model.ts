import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { IEventMarket, IEventMarketPublic, IEventMarketCount } from "../interfaces/event.market.interface";
import { IEventSelectionPublic } from "../../event.selection/interfaces/event.selection.interface";
import { EventStatus } from "../../../../../EventService/src/components/events/enums/event_status.enum";

export class EventMarket extends BaseModel implements IEventMarket {
    public static tableName = "event_market";
    public id: number;
    public market_id: number;
    public event_id: number;
    public status_id: EventStatus;

    constructor(data: IEventMarket) {
        super();
        this.id = data.id;
        this.market_id = data.market_id;
        this.event_id = data.event_id;
        this.status_id = data.status_id;
    }
}

export class EventMarketPublic implements IEventMarketPublic {
    public id: number;
    public market_id: number;
    public event_id: number;
    public status_id: EventStatus;
    public name?: string;
    public lang_id?: string;
    public selections: IEventSelectionPublic[];
    public order_id?: number;
    public is_tipster?: boolean
    public is_tipster_default?: boolean
    public multi_winner?: boolean

    constructor(data: IEventMarketPublic) {
        this.id = data.id;
        this.market_id = data.market_id;
        this.event_id = data.event_id;
        this.status_id = data.status_id;
        this.name = data.name;
        this.lang_id = data.lang_id;
        this.selections = data.selections || [];
        this.order_id = data.order_id;
        this.is_tipster = data.is_tipster;
        this.is_tipster_default = data.is_tipster_default;
        this.multi_winner = data.multi_winner;
    }
}

export class EventMarketCount implements IEventMarketCount {
    public event_id: number;
    public count: number;

    constructor(data: IEventMarketCount) {
        this.event_id = data.event_id;
        this.count = data.count;
    }
}