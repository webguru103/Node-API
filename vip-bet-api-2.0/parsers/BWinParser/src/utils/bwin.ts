import { HTTPUtil } from "./httpUtil";
import { IFeedParticipant } from "../../../BaseParser/src/interfaces/IFeedParticipant";
import { reduce } from "bluebird";
import { isArray } from "lodash";

export class Bwin {
    private static API_TOKEN = "bc5518a2-9aad-420b-9d86-c97df64f4c96";
    private static API_URL = "http://prod-bfo-api-v2.gp-cloud.com";
    private static API = {
        SPORTS: `${Bwin.API_URL}/getListSports`,
        LEAGUES: `${Bwin.API_URL}/getListParents`,
        EVENTS: `${Bwin.API_URL}/getListEvents`,
        EVENT_MARKETS: `${Bwin.API_URL}/getListMarkets`,
        EVENT_MARKET_SELECTIONS: `${Bwin.API_URL}/getListSelections`,
        EVENT_MARKET_SELECTIONS_ODDS: `${Bwin.API_URL}/getListFixedOdds`
    }

    public static async getSports(): Promise<IBetFairSport[]> {
        return HTTPUtil.scheduleRequest(Bwin.API.SPORTS, undefined, "post", { "token": Bwin.API_TOKEN });
    }

    public static async getLeagues(sportId: string): Promise<IBetFairLeague[]> {
        return HTTPUtil.scheduleRequest(Bwin.API.LEAGUES, undefined, "post", { "token": Bwin.API_TOKEN, bf_sport_id: sportId.toString() });
    }

    public static async getEvents(leagueId: string): Promise<IBetFairEvent[]> {
        return HTTPUtil.scheduleRequest(Bwin.API.EVENTS, undefined, "post", { "token": Bwin.API_TOKEN, bf_parent_id: leagueId.toString() });
    }

    public static async getEventMarkets(eventId: string): Promise<IBetFairEventMarket[]> {
        return HTTPUtil.scheduleRequest(Bwin.API.EVENT_MARKETS, undefined, "post", { "token": Bwin.API_TOKEN, bf_event_id: eventId.toString() });
    }

    public static async getMarketSelections(marketId: string): Promise<IBetFairSelection[] | undefined> {
        const selections: IBetFairSelection[] = await HTTPUtil.scheduleRequest(Bwin.API.EVENT_MARKET_SELECTIONS, undefined, "post", { "token": Bwin.API_TOKEN, sp_market_id: marketId });
        if (!isArray(selections)) return;
        const odds = await HTTPUtil.scheduleRequest(Bwin.API.EVENT_MARKET_SELECTIONS_ODDS, undefined, "post", { "token": Bwin.API_TOKEN, market_id: marketId });
        if (!isArray(odds.selections)) return;
        return reduce(selections, async (result: IBetFairSelection[], selection) => {
            const odd = odds.selections.find(s => s.bf_selection_id == selection.bf_selection_id);
            if (!odd) return result;
            selection.odd = odd.odds;
            selection.handicap = odd.handicap;
            result.push(selection);
            return result;
        }, [])
    }
}


export interface IBetFairSport {
    bf_sport_id: string;
    bf_sport_name: string;
}

export interface IBetFairLeague {
    bf_sport_id: string
    bf_country_id: string;
    bf_parent_id: string;
    bf_parent_name: string;
}

export interface IBetFairEvent {
    in_play: string;
    event_hierarchy: string;
    event_name: string;
    start_time: {
        $date: number
    },
    bf_event_id: string,
    real_start_time: {
        $date: number
    },
    bf_sport_id: string;
    bf_country_id: string;
    bf_league_id: string;
    link: string
}

export interface IBetFairEventMarket {
    bf_sport_id: string;
    bf_event_id: string;
    participants: IFeedParticipant[];
    bf_market_id: string;
    sp_market_id: string;
    start_time: {
        $date: number
    };
    real_start_time: {
        $date: number
    };
    in_play: string;
    status: string;
    market_type: string;
    market_name: string;
    handicap: string;
}

export interface IBetFairSelection {
    bf_sport_id: string;
    market_type: string;
    bf_event_id: string;
    bf_market_id: string;
    sp_market_id: string;
    bf_selection_id: string;
    selection_name: string;
    participants: IFeedParticipant[];
    handicap: string;
    odd: number;
}