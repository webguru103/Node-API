import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../CommonJS/src/messaging/QueueType";
import { handleResponse } from "../utils/route.utill";
import { Router, Request, Response } from "express";
import { broker } from "../../../CommonJS/src/base/base.model";
import { AdminRequest, LogAction } from "../middleware/authentication.middleware";

const router = Router();

router.post("/statisticType", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.ADD_STATISTIC_TYPE, req.body, QueueType.RESULT_SERVICE))
});

router.post("/statisticType/:id", AdminRequest, LogAction, (req: Request, res: Response) => {
    const scope = Object.assign({}, req.body, req.params);
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.UPDATE_STATISTIC_TYPE, scope, QueueType.RESULT_SERVICE))
});

router.delete("/statisticType/:id", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.DELETE_STATISTIC_TYPE, req.params, QueueType.RESULT_SERVICE))
});

router.get("/statisticTypes", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_STATISTIC_TYPES, req.query, QueueType.RESULT_SERVICE))
});

router.post("/statisticTypes", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.UPDATE_STATISTIC_TYPES, req.body, QueueType.RESULT_SERVICE))
});

module.exports = router;