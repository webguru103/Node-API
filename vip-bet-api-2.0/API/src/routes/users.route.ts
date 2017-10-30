/**
 * Created by   on 3/10/2017.
 */
import { Request, Response, Router } from "express";
import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../CommonJS/src/messaging/QueueType";
import { broker } from "../../../CommonJS/src/base/base.model";
import { UserSanitized, User } from "../components/users/models/user.model";
import { RespondWithJson, RespondWithError } from "../middleware/base.middleware";
import { AdminRequest, UserRequest, LogAction } from "../middleware/authentication.middleware";
import { BAD_REQUEST, NOT_FOUND } from "http-status-codes";
import { UserFilter } from "../components/users/filters/user.filter";
import { UserRoles } from "../components/user_roles/models/user_roles.model";
import { isArray } from "lodash";
import { handleResponse } from "../utils/route.utill";

let router = Router();

async function verifyUser(req: Request, res: Response) {
    // if non of unique fields provided return error
    if (req.body.username === undefined
        && req.body.email === undefined
        && req.body.wordpress_id === undefined
        && req.body.wordpress_username === undefined
        && req.body.facebook_id === undefined
        && req.body.linkedin_id === undefined) return RespondWithError(req, res, BAD_REQUEST);
    // try to find user
    let user = await User.findOne(<any>User, { username: req.body.username });
    // if user already exists return
    if (user) return RespondWithError(req, res, BAD_REQUEST, "User with this username already registered");
    // try to find user
    user = await User.findOne(<any>User, { email: req.body.email });
    // if user already exists return
    if (user) return RespondWithError(req, res, BAD_REQUEST, "User with this email already registered");
    // try to find user
    user = await User.findOne(<any>User, { wordpress_id: String(req.body.wordpress_id) });
    // if user already exists return
    if (user) return RespondWithError(req, res, BAD_REQUEST, "User with this wordpress_id already registered");
    // try to find user
    user = await User.findOne(<any>User, { wordpress_username: String(req.body.wordpress_username) });
    // if user already exists return
    if (user) return RespondWithError(req, res, BAD_REQUEST, "User with this wordpress_username already registered");
    // try to find user
    user = await User.findOne(<any>User, { facebook_id: req.body.facebook_id });
    // if user already exists return
    if (user) return RespondWithError(req, res, BAD_REQUEST, "User with this facebook_id already registered");
    // try to find user
    user = await User.findOne(<any>User, { linkedin_id: req.body.linkedin_id });
    // if user already exists return
    if (user) return RespondWithError(req, res, BAD_REQUEST, "User with this linkedin_id already registered");
}

router.post("/users", async (req: Request, res: Response) => {
    await verifyUser(req, res);
    // create new user
    const user = new UserSanitized(req.body);
    // check email
    if (req.body.email !== undefined && user.email === undefined) return RespondWithError(req, res, BAD_REQUEST, "Wrong email provided");
    // generate password hash
    await user.generateSaltAndHash(req.body.password);
    // save and return user
    RespondWithJson(res, await user.saveWithID());
});

router.post("/admins", AdminRequest, LogAction, async (req: Request, res: Response) => {
    if (req.body.user_roles === undefined || !isArray(req.body.user_roles) || req.body.user_roles.length === 0) return RespondWithError(req, res, BAD_REQUEST, "Admins should have permissions");
    // verify user
    await verifyUser(req, res);
    // create new user
    const user = new User(req.body);
    // check email
    if (req.body.email !== undefined && user.email === undefined) return RespondWithError(req, res, BAD_REQUEST, "Wrong email provided");
    // add admin and user permission if it is missing
    if (!user.user_roles.includes(UserRoles.admin_permission_string)) user.user_roles.push(UserRoles.admin_permission_string);
    if (!user.user_roles.includes(UserRoles.user_permission_string)) user.user_roles.push(UserRoles.user_permission_string);
    // generate password hash
    await user.generateSaltAndHash(req.body.password);
    // save and return user
    RespondWithJson(res, await user.saveWithID());
});

router.get("/users", AdminRequest, LogAction, async (req: Request, res: Response) => {
    RespondWithJson(res, await new UserFilter(req.query).find());
});

router.get("/users/:id", AdminRequest, LogAction, async (req: Request, res: Response) => {
    RespondWithJson(res, await User.findOne(<any>User, { id: req.params.id }));
});

router.post("/users/:id", AdminRequest, LogAction, async (req: Request, res: Response) => {
    const user: User = await User.findOne(<any>User, { id: req.params.id });
    if (!user) return RespondWithError(req, res, NOT_FOUND, "User not found");
    RespondWithJson(res, await new User(user).applySettings(new User(req.body)));
});

router.delete("/users/:id", AdminRequest, LogAction, async (req: Request, res: Response) => {
    RespondWithJson(res, await User.delete(<any>User, { id: req.params.id }));
});

router.get("/users/:user_id/statistics/bettings", (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_USER_BETTING_STATISTICS, Object.assign({}, req.query, req.params), QueueType.BETSLIP_SERVICE))
});

router.get("/profile", UserRequest, LogAction, async (req: Request, res: Response) => {
    RespondWithJson(res, await User.findOne(<any>User, { id: req.user.id }));
});

router.post("/profile", UserRequest, LogAction, async (req: Request, res: Response) => {
    RespondWithJson(res, await new User(req.user).update(req.body));
});

router.delete("/profile", UserRequest, LogAction, async (req: Request, res: Response) => {
    RespondWithJson(res, await new User(req.user).delete());
});

router.get("/profile/statistics/bettings", UserRequest, LogAction, (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_USER_BETTING_STATISTICS, Object.assign({}, req.query, { user_id: req.user.id }), QueueType.BETSLIP_SERVICE))
});

router.get("/betting/objects", (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_USER_TIPSTER_OBJECTS, req.query, QueueType.BETSLIP_SERVICE))
});

router.get("/leaderboard", (req: Request, res: Response) => {
    handleResponse(req, res,
        broker.sendRequest(CommunicationCodes.GET_LEADERBOARD, req.query, QueueType.BETSLIP_SERVICE))
});

router.get("/permissions", AdminRequest, LogAction, (req: Request, res: Response) => {
    RespondWithJson(res, UserRoles.GetPermissions());
});

router.get("/admins/permissions", AdminRequest, LogAction, async (req: Request, res: Response) => {
    RespondWithJson(res, req.user.user_roles);
});

module.exports = router;