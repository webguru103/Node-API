/**
 * Created by   on 3/10/2017.
 */
import { Router, Request, Response } from "express";
import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../CommonJS/src/messaging/QueueType";
import { broker } from "../../../CommonJS/src/base/base.model";
import { AdminRequest, SetUserToRequest, LogAction } from "../middleware/authentication.middleware";
import { UserRoles } from "../components/user_roles/models/user_roles.model";
import { handleResponse } from "../utils/route.utill";
import { CategoryStatus } from "../../../CategoryService/src/components/category/enums/category_status.enum";

const router = Router();

router.post("/category/add", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.ADD_CATEGORY, req.body, QueueType.CATEGORY_SERVICE))
});

router.delete("/category/delete", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.DELETE_CATEGORY, req.body, QueueType.CATEGORY_SERVICE))
});

router.post("/category/update", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.UPDATE_CATEGORY, req.body, QueueType.CATEGORY_SERVICE))
});

router.get("/category/getMappingsByProviderId", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_CATEGORY_MAPPINGS_BY_PROVIDER_ID, req.query, QueueType.CATEGORY_SERVICE))
});

router.post("/category/map", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.MAP_CATEGORY, req.body, QueueType.MAPPING_SERVICE));
});

router.post("/category/appendMap", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.APPEND_MAP_CATEGORY, req.body, QueueType.MAPPING_SERVICE));
});

router.post("/category/unmap", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.UN_MAP_CATEGORY, req.body, QueueType.MAPPING_SERVICE));
});

router.post("/category/unmapProviderCategory", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.UN_MAP_PROVIDER_CATEGORY, req.body, QueueType.MAPPING_SERVICE));
});

router.get("/category/getCategoryMappingsByProviderId", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_CATEGORY_MAPPINGS_BY_PROVIDER_ID, req.query, QueueType.MAPPING_SERVICE));
});

router.get("/category/getUnmappedCategoriesByProviderIdAndTypeId", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_UNMAPED_CATEGORIES_BY_PROVIDER_ID, req.query, QueueType.MAPPING_SERVICE));
});

router.post("/category/updateCategoryOrder", AdminRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.UPDATE_CATEGORY_ORDER, req.body, QueueType.CATEGORY_SERVICE));
});

router.get("/category/getByTimeRange", SetUserToRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_CATEGORIES_BY_TIME, req.query, QueueType.CATEGORY_SERVICE));
});

router.get("/category", SetUserToRequest, LogAction, async (req: Request, res: Response) => {
    const filter = Object.assign({}, req.query);
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_CATEGORIES, filter, QueueType.CATEGORY_SERVICE));
});

router.get("/category/getProviderLeaguesBySportId", AdminRequest, LogAction, (req: Request, res: Response) => {
    const filter = Object.assign({}, req.query);
    if (req.user && req.user.user_roles.includes(UserRoles.admin_mapping_league_active_only_permission_string)) {
        filter.status = CategoryStatus.ACTIVE;
    }
    handleResponse(req,res,
        broker.sendRequest(CommunicationCodes.GET_PROVIDER_LEAGUES_BY_SPORT_ID, filter, QueueType.MAPPING_SERVICE));
});

module.exports = router;