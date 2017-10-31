"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_util_1 = require("../../../CommonJS/src/utils/http.util");
const bluebird_1 = require("bluebird");
const lodash_1 = require("lodash");
class BetFair {
    static async getSports() {
        return http_util_1.queueRequest(BetFair.API.SPORTS, undefined, "post", { "token": BetFair.API_TOKEN });
    }
    static async getLeagues(sportId) {
        return http_util_1.queueRequest(BetFair.API.LEAGUES, undefined, "post", { "token": BetFair.API_TOKEN, bf_sport_id: sportId.toString() });
    }
    static async getEvents(leagueId) {
        return http_util_1.queueRequest(BetFair.API.EVENTS, undefined, "post", { "token": BetFair.API_TOKEN, bf_parent_id: leagueId.toString() });
    }
    static async getEventMarkets(eventId) {
        return http_util_1.queueRequest(BetFair.API.EVENT_MARKETS, undefined, "post", { "token": BetFair.API_TOKEN, bf_event_id: eventId.toString() });
    }
    static async getMarketSelections(marketId) {
        const selections = await http_util_1.queueRequest(BetFair.API.EVENT_MARKET_SELECTIONS, undefined, "post", { "token": BetFair.API_TOKEN, sp_market_id: marketId });
        if (!lodash_1.isArray(selections))
            return;
        const odds = await http_util_1.queueRequest(BetFair.API.EVENT_MARKET_SELECTIONS_ODDS, undefined, "post", { "token": BetFair.API_TOKEN, market_id: marketId });
        if (!lodash_1.isArray(odds.selections))
            return;
        return bluebird_1.reduce(selections, async (result, selection) => {
            const odd = odds.selections.find(s => s.bf_selection_id == selection.bf_selection_id);
            if (!odd)
                return result;
            selection.odd = odd.odds;
            selection.handicap = odd.handicap;
            result.push(selection);
            return result;
        }, []);
    }
}
BetFair.API_TOKEN = "bc5518a2-9aad-420b-9d86-c97df64f4c96";
BetFair.API_URL = "http://prod-bfo-api-v2.gp-cloud.com";
BetFair.API = {
    SPORTS: `${BetFair.API_URL}/getListSports`,
    LEAGUES: `${BetFair.API_URL}/getListParents`,
    EVENTS: `${BetFair.API_URL}/getListEvents`,
    EVENT_MARKETS: `${BetFair.API_URL}/getListMarkets`,
    EVENT_MARKET_SELECTIONS: `${BetFair.API_URL}/getListSelections`,
    EVENT_MARKET_SELECTIONS_ODDS: `${BetFair.API_URL}/getListFixedOdds`
};
exports.BetFair = BetFair;
//# sourceMappingURL=betfair.js.map