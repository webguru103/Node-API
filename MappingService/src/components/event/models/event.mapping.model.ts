import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { IEventMapping } from "../interfaces/event.mapping.interface";

export class EventMapping extends BaseModel implements IEventMapping {
    public static tableName: string = "event_mapping";
    public id: number;
    public provider_id: number;
    public provider_event_id: string;
    public start_date: Date;
    public system_event_id?: number;

    constructor(data: IEventMapping) {
        super();
        this.id = data.id;
        this.provider_id = data.provider_id;
        this.provider_event_id = data.provider_event_id;
        this.start_date = data.start_date;
        this.system_event_id = data.system_event_id;
    }
}