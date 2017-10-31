import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../CommonJS/src/messaging/QueueType";
import { Router, Request, Response } from "express";
import { broker } from "../../../CommonJS/src/base/base.model";
import { AdminRequest, LogAction } from "../middleware/authentication.middleware";
import { handleResponse } from "../utils/route.utill";

const router = Router();

router.post("/scope", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.ADD_SCOPE, req.body, QueueType.RESULT_SERVICE))
});

router.delete("/scope/:id", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.DELETE_SCOPE, req.params, QueueType.RESULT_SERVICE))
});

router.post("/scope/:id", AdminRequest, LogAction, (req: Request, res: Response) => {
    const scope = Object.assign({}, req.body, req.params);
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.UPDATE_SCOPE, scope, QueueType.RESULT_SERVICE))
});

router.get("/scopes", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_SCOPES, req.query, QueueType.RESULT_SERVICE))
});

router.post("/scopes", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.UPDATE_SCOPES, req.body, QueueType.RESULT_SERVICE))
});

module.exports = router;