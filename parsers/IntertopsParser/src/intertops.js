"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_util_1 = require("../../../CommonJS/src/utils/http.util");
class Intertops {
    static async getData(delta) {
        return http_util_1.queueRequest(Intertops.API.DATA(delta));
    }
}
Intertops.API_TOKEN = "4a29702b-9699-e711-8aa0-003048dd52d5";
Intertops.API_URL = "http://xmlfeed.intertops.com";
Intertops.API_VERSION = "v2";
Intertops.API = {
    DATA: (delta) => `${Intertops.API_URL}/xmloddsfeed/${Intertops.API_VERSION}/xml/feed.ashx?apikey=${Intertops.API_TOKEN}&delta=${delta}`,
};
exports.Intertops = Intertops;
//# sourceMappingURL=intertops.js.map