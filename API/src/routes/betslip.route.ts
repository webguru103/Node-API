/**
 * Created by   on 3/10/2017.
 */
import { Request, Response, Router } from 'express'
import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../CommonJS/src/messaging/QueueType";
import { handleResponse } from "../utils/route.utill";
import { PlaceBetSlipValidator, IdValidatorParams } from "../middleware/RequestValidator";
import { broker } from "../../../CommonJS/src/base/base.model";
import { UserRequest, AdminRequest, LogAction } from "../middleware/authentication.middleware";
import { User } from "../components/users/models/user.model";
const router = Router();

router.post("/betslips", UserRequest, PlaceBetSlipValidator, LogAction, (req: Request, res: Response) => {
    const betslip = Object.assign({}, req.body, { user_id: req.user.id });
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.PLACE_BET, betslip, QueueType.BETSLIP_SERVICE))
});

router.post("/betslips/:id", AdminRequest, IdValidatorParams, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.UPDATE_BET_SLIP, Object.assign({}, req.body, req.params), QueueType.BETSLIP_SERVICE))
});

router.get("/betslips/:id", UserRequest, IdValidatorParams, LogAction, (req: Request, res: Response) => {
    const filter = Object.assign({}, req.params);
    // if this is not admin then return only his bets
    if (!new User(req.user).isAdmin()) { filter.user_id = req.user.id };
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_BET_SLIP, filter, QueueType.BETSLIP_SERVICE))
});

router.get("/betslips", LogAction, (req: Request, res: Response) => {
    const filter = Object.assign({}, req.query);
    // if this is not admin then return only his bets
    if (req.user && !new User(req.user).isAdmin()) { filter.user_id = req.user.id };
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_BET_SLIPS, filter, QueueType.BETSLIP_SERVICE))
});

module.exports = router;