import { IBase } from "../../../../../CommonJS/src/base/base.interface";
import { Provider } from "../../../../../CommonService/src/components/provider/models/provider.model";
import { IEventMarketPublic } from "../../../../../EventMarketService/src/components/event.market/interfaces/event.market.interface";
import { EventType } from "../enums/event_type.enum";
import { EventStatus } from "../enums/event_status.enum";

export interface IEvent extends IBase {
    id: number;
    name: string;
    dict_id: number;
    lang_id: number;
    type_id: EventType;
    participants: number[];
    start_date: Date;
    status: EventStatus;
    sport_id: number;
    sport_name: string;
    sport_status_id: number;
    country_id: number;
    country_name: string;
    country_status_id: number;
    league_id: number;
    league_name: string;
    league_status_id: number;
    markets_count: number;
    markets: IEventMarketPublic[];
    providers: Provider[];
    full_count: number;
}