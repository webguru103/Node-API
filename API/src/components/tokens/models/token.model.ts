
/**
 * Token model implements an interface reflecting the DB schema
 * 
 * @export
 * @class Token
 * @implements {IToken}
 */
import { IToken } from "../interfaces/token.interface";
import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { IUserPermissions } from "../../user_roles/interfaces/user_permissions.interface";
import { UserRoles } from "../../user_roles/models/user_roles.model";

export class Token extends BaseModel implements IToken {
    public static tableName: string = 'tokens'
    public id?: number //self id v4 (random)
    public created?: Date //date the token created
    public expires?: Date  //date the token expires
    public updated?: Date  //date the token updated
    public canceled?: boolean  //states if the token was canceled
    public device?: string //states the device the token comes from (web, ios, android)
    public device_id?: string //states the device identification (OS, Build etc) the token originates from
    public version?: string //self token version
    public issuer?: string //issuer
    public algorithms?: string //the algorithms
    public permissions: IUserPermissions
    public user_id?: number
    public utm?: string
    public referrer?: string
    /**
     * Creates an instance of Token.
     * @param {IToken} init 
     * 
     * @memberof Token
     */
    public constructor(init: IToken) {
        super()
        this.id = init.id;
        this.created = init.created || new Date();
        this.expires = init.expires
        this.updated = init.updated
        this.canceled = init.canceled || false
        this.device = init.device || 'web'
        this.device_id = init.device_id || 'web'
        this.version = init.version || '1.0'
        this.issuer = init.issuer || 'vipbet'
        this.permissions = init.permissions
        this.user_id = init.user_id
        this.utm = init.utm
        this.referrer = init.referrer
    }
}
/**
 * Guest Token Class 
 * 
 * @export
 * @class GuestToken
 * @extends {Token}
 */
export class GuestToken extends Token {
    public permissions: IUserPermissions // set User permission by default. Should change to Guest
    constructor(init: IToken) {
        init.permissions = init.permissions || UserRoles.GetGuestPermissions
        super(init)
    }
}
/**
 * User Token Class
 * 
 * @export
 * @class UserToken
 * @extends {Token}
 */
export class UserToken extends Token {
    public user_id: number // the value should be id ie '00000000-0000-0000-0000-000000000000' corresponding user id v4 (random)
    //public permissions: IUserPermissions   // set User permission by default. Should change to Guest
    /**
     * Creates an instance of UserToken.
     * @param {IToken} init 
     * 
     * @memberof UserToken
     */
    constructor(init: IToken) {
        init.permissions = init.permissions || UserRoles.GetUserPermissions
        super(init)
    }
}