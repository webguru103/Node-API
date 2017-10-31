/**
 * Created by   on 3/17/2017.
 */
import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../CommonJS/src/messaging/QueueType";
import { Router, Request, Response } from "express";
import { broker } from "../../../CommonJS/src/base/base.model";
import { AdminRequest, LogAction } from "../middleware/authentication.middleware";
import { handleResponse } from "../utils/route.utill";

let router = Router();

router.get("/warning/getWarningsCount", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_WARNINGS_COUNT, req.query, QueueType.WARNINGS))
});

router.get("/warning/getCategoryWarnings", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_CATEGORY_MAPPING_WARNINGS, req.query, QueueType.WARNINGS))
});

router.get("/warning/getParticipantWarnings", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_PARTICIPANT_MAPPING_WARNINGS, req.query, QueueType.WARNINGS))
});

router.get("/warning/getMarketWarnings", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_MARKET_MAPPING_WARNINGS, req.query, QueueType.WARNINGS))
});

router.get("/warning/getSelectionWarnings", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_SELECTION_MAPPING_WARNINGS, req.query, QueueType.WARNINGS))
});

module.exports = router;