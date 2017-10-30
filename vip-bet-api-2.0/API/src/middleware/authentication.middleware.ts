import { JWTRequest } from "../components/auth/interfaces/authenticated_request.interface";
import { GuestJWT, UserJWT } from "../components/auth/models/jsonwebtoken.model";
import { authenticate } from "passport";
import { NextFunction, Response, Request } from "express";
import { UserRoles } from "../components/user_roles/models/user_roles.model";
import { UNAUTHORIZED, FORBIDDEN } from "http-status-codes";
import { RespondWithError } from "./base.middleware";
import { UserStatus } from "../components/users/enums/user.status.enum";
import { UserAction } from "../components/user_actions/models/user_actions.model";
import { Token } from "../components/tokens/models/token.model";
var getIP = require('ipware')().get_ip;

/**
 * Sync Helper Extracts access_code from Request Headers, QueryString or Request Body
 * 
 * @export
 * @param {JWTRequest} req 
 * @returns {(string|undefined)} 
 */
export function ExtractAuthToken(req: JWTRequest): string | undefined {
    const headerAuthorization = <string | undefined>(req.headers.Authorization || req.headers.authorization);
    const splittedHeader = headerAuthorization ? headerAuthorization.split(' ') : null;
    return (splittedHeader && splittedHeader[splittedHeader.length - 1] || req.query && req.query.access_token || req.body && req.body.access_token)
}
/**
 * Error represents a fail of verification of the token against database check
 * 
 * @export
 * @class AuthVerificationFailed
 * @extends {Error}
 */
export class AuthVerificationFailed extends Error {
    public name: string
    public type: string
    /**
     * Creates an instance of AuthVerificationFailed.
     * @param {{ message?:string, type:string }} [obj={ message: 'Authorization failed. Data can't be verified', type: 'AuthVerificationFailed'  }] 
     * 
     * @memberof AuthVerificationFailed
     */
    constructor(obj: { message?: string, type: string } = { message: 'Authorization failed. Data can\'t be verified', type: 'AuthVerificationFailed' }) {
        super(obj.message)
        Object.setPrototypeOf(this, new.target.prototype)
        this.name = (this.constructor as any).name
        this.type = obj.type
    }
}

/**
 * Async Decodes and Verifies for authenticity Guest Token and returns GuestJWT instance
 * 
 * @export
 * @param {string} token 
 * @returns {Promise<GuestJWT>} 
 */
export async function AuthenticateGuestToken(token: string): Promise<GuestJWT> {
    const decoded = await GuestJWT.decode(token)
    return new GuestJWT(decoded.data)
}
/**
 * Async  Decodes and Verifies for authenticity User Token and returns UserJWT instance
 * 
 * @export
 * @param {string} token 
 * @returns 
 */
export async function AuthenticateUserToken(token: string): Promise<UserJWT> {
    const decoded = await UserJWT.decode(token)
    return new UserJWT(decoded.data)
}

export async function AdminRequest(req: Request, res: Response, next: NextFunction) {
    authenticate(['jwt'], async (data, user) => {
        if (!user) return RespondWithError(req, res, UNAUTHORIZED, "Unauthorized user");
        // check token
        const token: Token | undefined = await Token.findOne(<any>Token, { user_id: user.id });
        if (!token) return RespondWithError(req, res, UNAUTHORIZED, "Unauthorized user");
        if (token.canceled) return RespondWithError(req, res, UNAUTHORIZED, "Unauthorized user");
        // 
        if (user.status_id !== UserStatus.ACTIVE) return RespondWithError(req, res, FORBIDDEN, "You don't have permission for this");
        if (!user.user_roles.includes(UserRoles.admin_permission_string)) return RespondWithError(req, res, FORBIDDEN, "You don't have permission for this");
        req.user = user;
        new UserAction({ date: new Date(), user_id: user.id, ip: getIP(req).clientIp, action: req.url }).saveWithID();
        next();
    })(req, res, next);
}

export async function UserRequest(req: Request, res: Response, next: NextFunction) {
    authenticate(['jwt'], async (data, user) => {
        if (!user) return RespondWithError(req, res, UNAUTHORIZED, "Unauthorized user");
        // check token
        const token: Token | undefined = await Token.findOne(<any>Token, { user_id: user.id });
        if (!token) return RespondWithError(req, res, UNAUTHORIZED, "Unauthorized user");
        if (token.canceled) return RespondWithError(req, res, UNAUTHORIZED, "Unauthorized user");
        // 
        if (user.status_id !== UserStatus.ACTIVE) return RespondWithError(req, res, FORBIDDEN, "You don't have permission for this");
        if (!user.user_roles.includes(UserRoles.user_permission_string)) return RespondWithError(req, res, FORBIDDEN, "You don't have permission for this");
        req.user = user;
        next();
    })(req, res, next);
}

export async function SetUserToRequest(req: Request, res: Response, next: NextFunction) {
    authenticate(['jwt'], (data, user) => {
        req.user = user;
        next();
    })(req, res, next);
}

export async function LogAction(req: Request, res: Response, next: NextFunction) {
    const user = req.user;
    if (user === undefined) return next();
    new UserAction({ date: new Date(), user_id: user.id, ip: getIP(req).clientIp, action: req.url }).saveWithID();
    next();
}