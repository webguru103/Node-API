import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { Translate } from "../../../../../CommonJS/src/components/translates/models/translate.model";
import { IEvent } from "../interfaces/event.interface";
import { Provider } from "../../../../../CommonService/src/components/provider/models/provider.model";
import { IEventMarketPublic } from "../../../../../EventMarketService/src/components/event.market/interfaces/event.market.interface";
import { EventType } from "../enums/event_type.enum";
import { EventStatus } from "../enums/event_status.enum";

export class Event extends BaseModel implements IEvent {
    public static tableName = "events";
    public id: number;
    public name: string;
    public dict_id: number;
    public lang_id: number;
    public type_id: EventType;
    public participants: number[];
    public start_date: Date;
    public status: EventStatus;
    public sport_id: number;
    public sport_name: string;
    public sport_status_id: number;
    public country_id: number;
    public country_name: string;
    public country_status_id: number;
    public league_id: number;
    public league_name: string;
    public league_status_id: number;
    public markets_count: number;
    public markets: IEventMarketPublic[];
    public providers: Provider[];
    public full_count: number;

    constructor(data: IEvent) {
        super();
        this.id = data.id;
        this.name = data.name;
        this.dict_id = data.dict_id;
        this.lang_id = data.lang_id;
        this.type_id = data.type_id;
        this.participants = data.participants || [];
        this.start_date = data.start_date;
        this.status = data.status;
        this.sport_id = data.sport_id;
        this.sport_name = data.sport_name;
        this.sport_status_id = data.sport_status_id;
        this.country_id = data.country_id;
        this.country_name = data.country_name;
        this.country_status_id = data.country_status_id;
        this.league_id = data.league_id;
        this.league_name = data.league_name;
        this.league_status_id = data.league_status_id;
        this.markets_count = data.markets_count;
        this.markets = data.markets;
        this.providers = data.providers;
        this.full_count = data.full_count;
    }

    public async saveWithID() {
        let translate = new Translate(<any>{ lang_id: this.lang_id, translation: this.name });
        await translate.saveWithID();

        this.dict_id = <number>translate.dict_id;

        let eventSave = new EventSaveModel(this);
        await eventSave.saveWithID("on conflict(participants, start_date) do update set start_date = '" + this.start_date + "'");
        this.id = eventSave.id;

        return this;
    }

    public async update(data: Event) {
        let eventSave = new EventSaveModel(this);
        await eventSave.update();
        return this;
    }
}

class EventSaveModel extends BaseModel {
    public static tableName = "events";
    public id: number;
    public dict_id: number;
    public type_id: EventType;
    public participants: number[];
    public start_date: Date;
    public status: EventStatus;
    public sport_id: number;
    public sport_status_id: number;
    public country_id: number;
    public country_status_id: number;
    public league_id: number;
    public league_status_id: number;

    constructor(data: EventSaveModel) {
        super();
        this.id = data.id;
        this.dict_id = data.dict_id;
        this.type_id = data.type_id;
        this.start_date = data.start_date;
        this.status = data.status;
        this.participants = data.participants;
        this.sport_id = data.sport_id;
        this.sport_status_id = data.sport_status_id;
        this.country_id = data.country_id;
        this.country_status_id = data.country_status_id;
        this.league_id = data.league_id;
        this.league_status_id = data.league_status_id;
    }
}

export class EventPublic extends BaseModel {
    public id: number;
    public name: string;
    public type_id: EventType;
    public start_date: Date;
    public status: EventStatus;
    public sport_id: number;
    public country_id: number;
    public league_id: number;
    public markets_count: number;
    public full_count: number;

    constructor(data: Event) {
        super();
        this.id = data.id;
        this.name = data.name;
        this.type_id = data.type_id;
        this.start_date = data.start_date;
        this.status = data.status;
        this.sport_id = data.sport_id;
        this.country_id = data.country_id;
        this.league_id = data.league_id;
        this.markets_count = data.markets_count;
        this.full_count = data.full_count;
    }
}