import { queueRequest } from "../../../CommonJS/src/utils/http.util";
import { reduce } from "bluebird";
import { isArray } from "lodash";
import { IFeedParticipant } from "../../BaseParser/src/interfaces/IFeedParticipant";

export class BetFair {
    private static API_TOKEN = "bc5518a2-9aad-420b-9d86-c97df64f4c96";
    private static API_URL = "http://prod-bfo-api-v2.gp-cloud.com";
    private static API = {
        SPORTS: `${BetFair.API_URL}/getListSports`,
        LEAGUES: `${BetFair.API_URL}/getListParents`,
        EVENTS: `${BetFair.API_URL}/getListEvents`,
        EVENT_MARKETS: `${BetFair.API_URL}/getListMarkets`,
        EVENT_MARKET_SELECTIONS: `${BetFair.API_URL}/getListSelections`,
        EVENT_MARKET_SELECTIONS_ODDS: `${BetFair.API_URL}/getListFixedOdds`
    }

    public static async getSports(): Promise<ISport[]> {
        return queueRequest(BetFair.API.SPORTS, undefined, "post", { "token": BetFair.API_TOKEN });
    }

    public static async getLeagues(sportId: string): Promise<ILeague[]> {
        return queueRequest(BetFair.API.LEAGUES, undefined, "post", { "token": BetFair.API_TOKEN, bf_sport_id: sportId.toString() });
    }

    public static async getEvents(leagueId: string): Promise<IEvent[]> {
        return queueRequest(BetFair.API.EVENTS, undefined, "post", { "token": BetFair.API_TOKEN, bf_parent_id: leagueId.toString() });
    }

    public static async getEventMarkets(eventId: string): Promise<IEventMarket[]> {
        return queueRequest(BetFair.API.EVENT_MARKETS, undefined, "post", { "token": BetFair.API_TOKEN, bf_event_id: eventId.toString() });
    }

    public static async getMarketSelections(marketId: string): Promise<ISelection[] | undefined> {
        const selections: ISelection[] = await queueRequest(BetFair.API.EVENT_MARKET_SELECTIONS, undefined, "post", { "token": BetFair.API_TOKEN, sp_market_id: marketId });
        if (!isArray(selections)) return;
        const odds = await queueRequest(BetFair.API.EVENT_MARKET_SELECTIONS_ODDS, undefined, "post", { "token": BetFair.API_TOKEN, market_id: marketId });
        if (!isArray(odds.selections)) return;
        return reduce(selections, async (result: ISelection[], selection) => {
            const odd = odds.selections.find(s => s.bf_selection_id == selection.bf_selection_id);
            if (!odd) return result;
            selection.odd = odd.odds;
            selection.handicap = odd.handicap;
            result.push(selection);
            return result;
        }, [])
    }
}


export interface ISport {
    bf_sport_id: string;
    bf_sport_name: string;
}

export interface ILeague {
    bf_sport_id: string
    bf_country_id: string;
    bf_parent_id: string;
    bf_parent_name: string;
}

export interface IEvent {
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

export interface IEventMarket {
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

export interface ISelection {
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