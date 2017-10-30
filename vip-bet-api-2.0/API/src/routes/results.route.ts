import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../CommonJS/src/messaging/QueueType";
import { Router, Request, Response } from "express";
import { broker } from "../../../CommonJS/src/base/base.model";
import { AdminRequest, LogAction } from "../middleware/authentication.middleware";
import { handleResponse } from "../utils/route.utill";

const router = Router();

router.post("/results/events/:id", AdminRequest, LogAction, (req: Request, res: Response) => {
    const data = Object.assign({}, req.params, req.body);
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.RESULT_EVENT, data, QueueType.RESULT_SERVICE))
});

router.get("/results/events/:id", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_EVENT_RESULT, req.params, QueueType.RESULT_SERVICE))
});

router.get("/results/events", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_EVENTS_RESULTS, req.query, QueueType.RESULT_SERVICE))
});


router.post("/results/selections", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.RESULT_EVENT_SELECTIONS, req.body, QueueType.RESULT_SERVICE))
});

router.get("/results/selections", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_EVENT_SELECTION_RESULTS, req.query, QueueType.RESULT_SERVICE))
});

module.exports = router;