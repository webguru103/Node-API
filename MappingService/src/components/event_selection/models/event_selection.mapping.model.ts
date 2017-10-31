import { IEventSelectionMapping } from "../interfaces/event_selection.mapping.interface";
import { BaseModel } from "../../../../../CommonJS/src/base/base.model";

export class EventSelectionMapping extends BaseModel implements IEventSelectionMapping {
    public static tableName: string = "event_selection_mapping";
    public id: number;
    public provider_id: number;
    public provider_event_selection_id: string;
    public provider_event_market_id: string;
    public provider_sport_id: string;
    public provider_market_id: string;
    public provider_selection_id: string;
    public system_event_selection_id: number;
    public argument: string;

    constructor(data: IEventSelectionMapping) {
        super();
        this.id = data.id;
        this.provider_event_market_id = data.provider_event_market_id;
        this.provider_event_selection_id = data.provider_event_selection_id;
        this.provider_id = data.provider_id;
        this.provider_market_id = data.provider_market_id;
        this.provider_selection_id = data.provider_selection_id;
        this.system_event_selection_id = data.system_event_selection_id;
        this.provider_sport_id = data.provider_sport_id;
    }
}