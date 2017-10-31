"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_util_1 = require("../../../CommonJS/src/utils/http.util");
class BetWayService {
    static async getEvents() {
        return http_util_1.queueRequest(BetWayService.API.EVENTS);
    }
}
BetWayService.API_KEY = "554015B7";
BetWayService.API_URL = "http://feeds.betway.com";
BetWayService.API = {
    EVENTS: `${BetWayService.API_URL}/events?key=${BetWayService.API_KEY}`
};
exports.BetWayService = BetWayService;
//# sourceMappingURL=betway.js.map