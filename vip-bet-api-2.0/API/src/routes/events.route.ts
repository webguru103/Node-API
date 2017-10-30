/**
 * Created by   on 3/10/2017.
 */
import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../CommonJS/src/messaging/QueueType";
import { Router, Request, Response } from "express";
import { broker } from "../../../CommonJS/src/base/base.model";
import { AdminRequest, LogAction, SetUserToRequest } from "../middleware/authentication.middleware";
import { handleResponse } from "../utils/route.utill";

const router = Router();

router.get("/events", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_EVENTS, req.query, QueueType.EVENT_SERVICE))
});

router.get("/events/getEvent", SetUserToRequest, LogAction, (req: Request, res: Response) => {
    const filter = Object.assign({}, req.query);
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_EVENT, filter, QueueType.EVENT_SERVICE))
});

router.get("/events/getEventsWithTipsterDefaultMarket", SetUserToRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_EVENTS_WITH_TIPSTER_DEFAULT_MARKET, req.query, QueueType.EVENT_SERVICE))
});

router.get("/events/getCategoriesByTime", SetUserToRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_EVENTS_CATEGORIES_BY_TIME, req.query, QueueType.EVENT_SERVICE))
});

module.exports = router;