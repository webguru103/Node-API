/**
 * Created by   on 3/10/2017.
 */
import { Request, Response, Router } from 'express'
import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../CommonJS/src/messaging/QueueType";
import { broker } from "../../../CommonJS/src/base/base.model";
import { AdminRequest, LogAction } from "../middleware/authentication.middleware";
import { handleResponse } from "../utils/route.utill";
const router = Router();

router.get("/betslipDetails/:id", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_BET_SLIP_DETAIL, req.params, QueueType.BETSLIP_SERVICE))
});

router.get("/betslipDetails", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_BET_SLIP_DETAILS, req.query, QueueType.BETSLIP_SERVICE))
});

router.post("/betslipDetails/:id", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.UPDATE_BET_SLIP_DETAIL, Object.assign({}, req.params, req.query, req.body), QueueType.BETSLIP_SERVICE))
});

module.exports = router;