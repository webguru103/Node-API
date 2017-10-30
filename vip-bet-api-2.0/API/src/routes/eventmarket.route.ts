/**
 * Created by   on 3/10/2017.
 */
import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../CommonJS/src/messaging/QueueType";
import { Router, Request, Response } from "express";
import { broker } from "../../../CommonJS/src/base/base.model";
import { AdminRequest, SetUserToRequest, LogAction } from "../middleware/authentication.middleware";
import { handleResponse } from "../utils/route.utill";

const router = Router();

router.get("/eventMarket/getEventMarkets", SetUserToRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_EVENT_MARKETS, req.query, QueueType.EVENT_MARKET_SERVICE))
});

router.get("/eventMarket/getEventMarket", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_EVENT_MARKET, req.query, QueueType.EVENT_MARKET_SERVICE))
});

router.get("/eventMarket/getProviderOdds", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_EVENT_SELECTIONS_BY_PROVIDER_ID_AND_EVENT_ID, req.query, QueueType.MAPPING_SERVICE))
});

router.get("/eventMarket/getEventProviderOdds", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_EVENT_SELECTIONS_FOR_ALL_PROVIDERS_BY_EVENT_ID, req.query, QueueType.MAPPING_SERVICE))
});

router.get("/eventMarket/getBestOdds", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_BEST_ODDS_BY_EVENT_MARKET_ID, req.query, QueueType.EVENT_MARKET_SERVICE))
});

router.get("/eventMarket/getEventMarketWithProviderOdds", SetUserToRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_EVENT_MARKET_ODDS, req.query, QueueType.EVENT_MARKET_SERVICE))
});

router.get("/eventMarket/getEventSelectionsOddsByProvider", SetUserToRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_EVENT_SELECTIONS_ODDS_BY_PROVIDER, req.query, QueueType.MAPPING_SERVICE))
});

router.get("/eventMarket/getEventSelectionsOddsByAllProviders", SetUserToRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_EVENT_SELECTIONS_ODDS_BY_ALL_PROVIDERS, req.query, QueueType.MAPPING_SERVICE))
});

router.get("/eventMarket/getEventSelectionsBestProviderOdds", SetUserToRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_EVENT_SELECTIONS_BEST_PROVIDER_ODDS, req.query, QueueType.MAPPING_SERVICE))
});

module.exports = router;