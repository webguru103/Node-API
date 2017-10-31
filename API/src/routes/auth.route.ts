/**
 * Created by   on 3/17/2017.
 */
import { Router, Request, Response } from "express";
import { BAD_REQUEST, UNAUTHORIZED } from "http-status-codes";
import { isString } from "lodash";
import { isEmail } from "validator";
import { User } from "../components/users/models/user.model";
import { JwtResponse } from "../components/auth/models/jsonwebtoken.model";
import { RespondWithJson, RespondWithError } from "../middleware/base.middleware";
import { UserRequest, LogAction } from "../middleware/authentication.middleware";
import { UserLogin } from "../components/user_logins/models/user_logins.model";
import { Token } from "../components/tokens/models/token.model";
var getIP = require('ipware')().get_ip;

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    if (email && !(isString(email) && isEmail(email))) return RespondWithError(req, res, BAD_REQUEST, "Email is incorrect");
    if (username && !isString(username)) return RespondWithError(req, res, BAD_REQUEST, "username is incorrect");
    let user: User = await User.findOne(<any>User, { email: email, username: username });
    if (!user) return RespondWithError(req, res, BAD_REQUEST, "Email or password is incorrect");
    // wrap user with model
    user = new User(user);
    const is_verified_password = await user.verifyPassword(password);
    if (!is_verified_password) return RespondWithError(req, res, UNAUTHORIZED, "Email or password is incorrect");
    // update last login date
    const ip = getIP(req).clientIp;
    // save user last login
    new UserLogin({ date: new Date(), ip: ip, user_id: user.id }).saveWithID();
    // return response
    RespondWithJson(res, await JwtResponse(user, this.body as any));
});

router.post("/login_wp", async (req: Request, res: Response) => {
    const wordpress_id = req.body.wordpress_id.toString();
    const wordpress_token = req.body.wordpress_token;
    let user: User = await User.findOne(<any>User, { wordpress_id: wordpress_id, wordpress_token: wordpress_token });
    if (!user) return RespondWithError(req, res, BAD_REQUEST, "Wordpress id/token is incorrect");
    // wrap user with model
    user = new User(user);
    RespondWithJson(res, await JwtResponse(user, this.body as any));
});

router.post("/logout", UserRequest, LogAction, async (req: Request, res: Response) => {
    // delete token
    const token: Token = await Token.findOne(<any>Token, { user_id: req.user.id });
    await new Token(token).delete();
    // 
    RespondWithJson(res);
});

router.post("/changePassword", UserRequest, LogAction, (req: Request, res: Response) => {

});

router.post("/forgotPassword", (req: Request, res: Response) => {

});

router.post("/setNewPassword", (req: Request, res: Response) => {

});

module.exports = router;