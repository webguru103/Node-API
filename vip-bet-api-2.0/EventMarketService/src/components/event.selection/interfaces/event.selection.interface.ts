
import { EventStatus } from "../../../../../EventService/src/components/events/enums/event_status.enum";

export interface IEventSelection {
    id: number;
    event_market_id: number;
    event_id: number;
    status_id: EventStatus;
    selection_id: number;
    argument?: string;
    odd?: number;
}

export interface IEventSelectionPublic extends IEventSelection {
    name?: string;
    lang_id?: string;
    odds: IProviderOdd[];
    row_index?: number;
    column_index?: number;
}

export interface IProviderOdd {
    id: number;
    provider_id: number;
    odd: number;
    status: EventStatus;
    name?: string;
}

export interface IProviderInfo {
    id: number;
    name: string;
    total_odd?: number;
}

export interface IProviderSelections {
    provider: IProviderInfo;
    selections: IEventSelection[];
}