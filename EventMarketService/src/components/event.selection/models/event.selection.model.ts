import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { IEventSelection, IEventSelectionPublic, IProviderOdd } from "../interfaces/event.selection.interface";
import { EventStatus } from "../../../../../EventService/src/components/events/enums/event_status.enum";

export class EventSelection extends BaseModel implements IEventSelection {
    public static tableName = "event_selection";
    public id: number;
    public event_market_id: number;
    public event_id: number;
    public status_id: EventStatus;
    public selection_id: number;
    public argument?: string;
    public odd?: number;

    constructor(data: IEventSelection) {
        super();
        this.id = data.id;
        this.event_id = data.event_id;
        this.event_market_id = data.event_market_id;
        this.selection_id = data.selection_id;
        this.argument = data.argument;
        this.odd = data.odd;
    }
}

export class EventSelectionPublic implements IEventSelectionPublic {
    public id: number;
    public event_market_id: number;
    public event_id: number;
    public status_id: EventStatus;
    public selection_id: number;
    public argument?: string;
    public odd?: number;
    public name?: string;
    public lang_id?: string;
    public odds: IProviderOdd[];
    public row_index?: number;
    public column_index?: number;

    constructor(data: IEventSelectionPublic) {
        this.id = data.id;
        this.event_id = data.event_id;
        this.event_market_id = data.event_market_id;
        this.selection_id = data.selection_id;
        this.argument = data.argument;
        this.odd = data.odd;
        this.name = data.name;
        this.lang_id = data.lang_id;
        this.odds = data.odds || [];
        this.row_index = data.row_index;
        this.column_index = data.column_index;
    }
}