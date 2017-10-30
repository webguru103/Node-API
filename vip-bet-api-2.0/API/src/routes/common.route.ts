/**
 * Created by   on 3/10/2017.
 */
import { Request, Response, Router } from "express";
import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../CommonJS/src/messaging/QueueType";
import { ExchangeType } from "../../../CommonJS/src/messaging/ExchangeType";
import { broker } from "../../../CommonJS/src/base/base.model";
import { AdminRequest, LogAction } from "../middleware/authentication.middleware";
import { handleResponse } from "../utils/route.utill";

const router = Router();

router.get("/common/providers", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_ALL_PROVIDERS, req.query, QueueType.COMMON_SERVICE))
});

router.get("/common/providers/:id", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_PROVIDER, req.params, QueueType.COMMON_SERVICE))
});

router.post("/common/providers/:id", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.UPDATE_PROVIDER, Object.assign({}, req.body, req.params), QueueType.COMMON_SERVICE))
});

router.post("/common/providers/:id/restart", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendToExchange(CommunicationCodes.RESTART_PROVIDER, req.params, ExchangeType.PROVIDER_EXCHANGE))
});

router.post("/common/providers/:id/stop", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendToExchange(CommunicationCodes.STOP_PROVIDER, req.params, ExchangeType.PROVIDER_EXCHANGE))
});

router.post("/common/providersOrder", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.UPDATE_PROVIDERS_ORDER, req.body, QueueType.COMMON_SERVICE), )
});


module.exports = router;