/**
 * Created by   on 3/11/2017.
 */
import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../CommonJS/src/messaging/QueueType";
import { Router, Request, Response } from "express";
import { broker } from "../../../CommonJS/src/base/base.model";
import { AdminRequest, LogAction } from "../middleware/authentication.middleware";
import { UserRoles } from "../components/user_roles/models/user_roles.model";
import { MarketStatus } from "../../../MarketService/src/components/markets/enums/market_status.enum";
import { handleResponse } from "../utils/route.utill";

const router = Router();

router.get("/markets", AdminRequest, LogAction, (req: Request, res: Response) => {
    const filter = Object.assign({}, req.query);
    if (req.user.user_roles.includes(UserRoles.admin_market_active_only_permission_string)) {
        filter.status_id = MarketStatus.ACTIVE;
    }
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_MARKETS, filter, QueueType.MARKET_SERVICE))
});

router.post("/market", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.ADD_MARKET, req.body, QueueType.MARKET_SERVICE))
});

router.get("/market/:id", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_MARKET, Object.assign({}, req.query, req.params), QueueType.MARKET_SERVICE))
});

router.post("/market/:id", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.UPDATE_MARKET, Object.assign({}, req.body, req.params), QueueType.MARKET_SERVICE))
});

router.delete("/market/:id", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.DELETE_MARKET, req.params, QueueType.MARKET_SERVICE))
});

router.post("/markets", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.UPDATE_MARKETS, req.body, QueueType.MARKET_SERVICE))
});

module.exports = router;