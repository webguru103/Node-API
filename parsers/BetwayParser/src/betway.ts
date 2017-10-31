import { queueRequest } from "../../../CommonJS/src/utils/http.util";
import { IFeedParticipant } from "../../BaseParser/src/interfaces/IFeedParticipant";
export class BetWayService {
    private static API_KEY = "554015B7";
    private static API_URL = "http://feeds.betway.com";
    private static API = {
        EVENTS: `${BetWayService.API_URL}/events?key=${BetWayService.API_KEY}`
    }

    public static async getEvents(): Promise<IBetWayData> {
        return queueRequest(BetWayService.API.EVENTS);
    }
}

export interface IBetWayData {
    EventList: IBetWayEventList;
}

export interface IBetWayEventList {
    Event: IBetWayEvent[];
}

export interface IBetWayEvent {
    $: {
        id: string;
        home_team_cname: string;
        away_team_cname: string;
        cname: string;
        start_at: Date;
        started: string;
    };
    Keywords: IBetWayKeyword[];
    Name: string[];
    Market: IBetWayMarket[];
}


export interface IBetWayKeyword {
    Keyword: IBetWayKeyword[];
    $: {
        cname: string;
        type_cname: string;
    };
    _: string;
}

export interface IBetWayMarket {
    $: {
        cname: string;
        each_way_active: string;
        each_way_fraction_den: string;
        each_way_position: string;
        forecast: string;
        handicap: number;
        id: string;
        index: string;
        interval_from: string;
        interval_to: string;
        situation_index: string;
        tricast: string;
        type_cname: string;
    };
    Name: string[];
    Outcome: IBetWayOutcome[];
    SportId: string;
    EventId: string;
    Participants: IFeedParticipant[];

}

export interface IBetWayOutcome {
    $: {
        cname: string;
        id: string;
        index: string;
        price_dec: number;
        price_den: number;
        price_num: number;
        starting_price: string;
        type_cname: string;
    };
    EventMarketId: string;
    SportId: string;
    MarketType: string;
    Participants: IFeedParticipant[];
    Argument: number;
    Name: string[];
}