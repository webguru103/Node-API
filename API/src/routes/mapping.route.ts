/**
 * Created by   on 3/10/2017.
 */
import { Router, Request, Response } from "express";
import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../CommonJS/src/messaging/QueueType";
import { broker } from "../../../CommonJS/src/base/base.model";
import { AdminRequest, LogAction } from "../middleware/authentication.middleware";
import { handleResponse } from "../utils/route.utill";

let router = Router();

router.post("/mapping/updateCategory", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.UPDATE_CATEGORY_MAPPING, req.body, QueueType.MAPPING_SERVICE))
});

router.post("/mapping/updateCategories", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.UPDATE_CATEGORY_MAPPINGS, req.body, QueueType.MAPPING_SERVICE))
});

router.get("/mapping/market/getUnmappedByProviderIdAndSportId", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_UNMAPPED_MARKETS_BY_PROVIDER_ID_AND_SPORT_ID, req.query, QueueType.MAPPING_SERVICE))
});

router.get("/mapping/market/getByProviderId", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_MARKET_MAPPINGS_BY_PROVIDER_ID, req.query, QueueType.MAPPING_SERVICE))
});

router.get("/mapping/selection/getByProviderIdAndMarketId", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_SELECTIONS_MAPPINGS_BY_PROVIDER_ID_AND_MARKET_ID, req.query, QueueType.MAPPING_SERVICE))
});

router.post("/mapping/market/mapWithSelections", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.MAP_MARKET_WITH_SELECTIONS, req.body, QueueType.MAPPING_SERVICE))
});

router.post("/mapping/participant/:id", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.UPDATE_PARTICIPANT_MAPPING, Object.assign({}, req.params, req.body), QueueType.MAPPING_SERVICE))
});

module.exports = router;