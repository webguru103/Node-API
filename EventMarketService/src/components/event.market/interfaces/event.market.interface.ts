import { IEventSelectionPublic } from "../../event.selection/interfaces/event.selection.interface";
import { EventStatus } from "../../../../../EventService/src/components/events/enums/event_status.enum";

export interface IEventMarket {
    id: number;
    market_id: number;
    event_id: number;
    status_id: EventStatus;
}

export interface IEventMarketPublic extends IEventMarket {
    name?: string;
    lang_id?: string;
    selections: IEventSelectionPublic[];
    order_id?: number
    is_tipster?: boolean
    is_tipster_default?: boolean
    multi_winner?: boolean
}

export interface IEventMarketCount {
    event_id: number;
    count: number;
}