import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../CommonJS/src/messaging/QueueType";
import { Router, Request, Response } from "express";
import { broker } from "../../../CommonJS/src/base/base.model";
import { AdminRequest, LogAction } from "../middleware/authentication.middleware";
import { handleResponse } from "../utils/route.utill";

const router = Router();

router.post("/rules", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.ADD_RULES, req.body, QueueType.RESULT_SERVICE))
});

router.get("/rules", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_RULES, req.query, QueueType.RESULT_SERVICE))
});

router.delete("/rules", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.DELETE_RULES, req.body, QueueType.RESULT_SERVICE))
});

module.exports = router;