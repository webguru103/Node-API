/**
 * Created by   on 3/17/2017.
 */
import { Request, Response, Router } from "express";
import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../CommonJS/src/messaging/QueueType";
import { broker } from "../../../CommonJS/src/base/base.model";
import { AdminRequest, LogAction } from "../middleware/authentication.middleware";
import { handleResponse } from "../utils/route.utill";

const router = Router();

router.post("/participants", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.ADD_PARTICIPANT, req.body, QueueType.PARTICIPANT_SERVICE))
});

router.post("/participants/:id", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.UPDATE_PARTICIPANT, req.body, QueueType.PARTICIPANT_SERVICE))
});

router.get("/participants/:id/leagues", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_PARTICIPANT_LEAGUES, Object.assign({}, req.params, req.query), QueueType.PARTICIPANT_SERVICE))
});

router.post("/participants/:id/leagues", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.UPDATE_PARTICIPANT_LEAGUES, Object.assign({}, req.params, req.body), QueueType.PARTICIPANT_SERVICE))
});

router.get("/participants/:system_participant_id/mappings", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_PARTICIPANT_MAPPINGS, Object.assign({}, req.params, req.query), QueueType.MAPPING_SERVICE))
});

router.post("/participants/:system_participant_id/mappings", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.MAP_PARTICIPANT, Object.assign({}, req.params, req.body), QueueType.MAPPING_SERVICE))
});

router.delete("/participants/:id", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.DELETE_PARTICIPANT, req.body, QueueType.PARTICIPANT_SERVICE))
});

router.get("/provider/:provider_id/participants", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_PROVIDER_PARTICIPANTS_BY_SPORT_ID, Object.assign({}, req.params, req.query), QueueType.MAPPING_SERVICE))
});

router.post("/participants/:id/map", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.MAP_PARTICIPANT, req.body, QueueType.PARTICIPANT_SERVICE))
});

router.get("/participants", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.SEARCH_PARTICIPANT, req.query, QueueType.PARTICIPANT_SERVICE))
});

router.post("/provider/:provider_id/mappings", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_PARTICIPANT_MAPPING, Object.assign({}, req.params, req.body), QueueType.MAPPING_SERVICE))
});

module.exports = router;