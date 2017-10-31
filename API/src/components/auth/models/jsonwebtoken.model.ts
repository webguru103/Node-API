import { isString } from 'lodash';
import { promisifyAll } from 'bluebird';
import * as jsonwebtoken from 'jsonwebtoken'
import { IJWTData } from "../interfaces/jsonwebtoken.interface";
import { ResolveFile } from "../../../utils/fs.utils";
import { Token, UserToken, GuestToken } from "../../tokens/models/token.model";
import { IToken } from "../../tokens/interfaces/token.interface";
import { Inflate, Deflate } from "../../../utils/crypto.utils";
import { BaseModel, QueryBuilder } from "../../../../../CommonJS/src/base/base.model";
import { User, PublicUserModel } from "../../users/models/user.model";

const JWT: any = promisifyAll(jsonwebtoken)

const PRIVATE_KEY = ResolveFile('keys', 'ca.key')
const CERTIFICATE = ResolveFile('keys', 'ca.crt')

/**
 * JWT API Error instance
 * 
 * @export
 * @class JWTError
 * @extends {Error}
 */
export class JWTError extends Error {
    public name: string
    public type: string
    constructor(obj: { message: string, type: string, code: string }) {
        super(obj.message)
        Object.setPrototypeOf(this, new.target.prototype)
        this.name = (this.constructor as any).name
        this.message = obj.message
        this.type = obj.type
    }
}
/**
 * Proxy JWT errors further
 */
export const JsonWebTokenError = JWT.JsonWebTokenError
export const TokenExpiredError = JWT.TokenExpiredError

export class JWTData implements IJWTData {
    public aud: string
    public iat: number
    public exp?: string | Date
    public sub?: string
    public data: Token
    public constructor(decoded: JWTData, data: IToken) {
        this.data = new Token(data)
        this.aud = decoded.aud
        this.iat = decoded.iat
    }
}
/**
 * General JsonWebToken Class
 * 
 * @export
 * @class JSONWebToken
 */
export class JSONWebToken {
    public decoded: Token
    public Encoded: string
    public audience: string
    /**
     * Async Decodes the Token or throws an error (CPU INTENSIVE)
     * Should provide options Object (even empty) for callback to work
     * @static
     * @param {string} token 
     * @returns {Promise<any>} 
     * 
     * @memberof JSONWebToken
     */
    public static async decode(token: string): Promise<IJWTData> {
        try {
            const decoded = await JWT.verifyAsync(token, CERTIFICATE)
            if (!isString(decoded.data)) throw new JWTError({ message: 'Data payload is incorrect', type: 'SyntaxError', code: 'jwterror_syntax' })
            const json = await Inflate(decoded.data)
            const data = JSON.parse(json)
            return new JWTData(decoded, data)
        } catch (err) {
            //Log only errors refering to some other module failure and not the wrong token
            if (!(err instanceof JsonWebTokenError || err instanceof TokenExpiredError || err instanceof JWTError)) console.error(err)
            throw new JWTError(err)
        }
    }
    /**
     * Async Encodes a Token (CPU INTENSIVE)
     * Should provide options Object (algorithm should be provided in case certificate is used) for callback to work
     * @static
     * @param {Partial<Token>} token 
     * @returns {Promise<any>} 
     * 
     * @memberof JSONWebToken
     */
    public static async encode(token: Token, options: jsonwebtoken.SignOptions = { audience: 'public:*' }): Promise<string> {
        //In case we want to reduce the payload size we need to deflate it
        const deflated_token = await Deflate(JSON.stringify(token))
        return JWT.signAsync({ data: deflated_token }, PRIVATE_KEY, options).catch((err: any) => {
            //Log only errors refering to some other module failure and not the wrong token
            if (!(err instanceof JsonWebTokenError || err instanceof TokenExpiredError)) console.error(err)
            throw err
        })
    }
    /**
     * Async Decodes the Token or throws an error (CPU INTENSIVE)
     * 
     * @param {string} token 
     * @returns {Promise<Token>} 
     * 
     * @memberof JSONWebToken
     */
    public async decode(token: string, options?: jsonwebtoken.DecodeOptions): Promise<Token> {
        const data = await JSONWebToken.decode(token)
        this.audience = data.aud || 'public:*'
        return this.decoded = data.data
    }
    /**
     * Async Encodes a Token (CPU INTENSIVE)
     * 
     * @returns {Promise<string>} 
     * 
     * @memberof JSONWebToken
     */
    public async encode(audience: string = this.audience || 'public:*', options: jsonwebtoken.SignOptions = { audience: 'public:*' }): Promise<string> {
        return this.Encoded = await JSONWebToken.encode(this.decoded, Object.assign({}, options, { audience }))
    }
    /**
     * Async Creates new Token in DB
     * 
     * @returns {Promise} 
     * 
     * @memberof JSONWebToken
     */
    public async save(): Promise<JSONWebToken> {
        await this.decoded.saveWithID();
        return this
    }
    /**
     * Async Check if the underlying token is marked valid or expired
     * 
     * @returns {Promise<boolean>} 
     * 
     * @memberof JSONWebToken
     */
    public isValid(): Promise<boolean> {
        const query = QueryBuilder.table(Token.tableName)
            .where({ id: this.decoded.id })
            .limit(1)
            .toString()
        return BaseModel.db(query).then((res) => {
            if (res.length === 0) return false //returns false if the token is not found
            return !res.filter(e => e.canceled).length //returns true if nothing found, returns false if the token is canceled
        })
    }
    /**
     * Async Updates Token in DB
     * 
     * @param {Token} data 
     * @returns {Promise<JSONWebToken>} 
     * 
     * @memberof JSONWebToken
     */
    public async update(data: Token): Promise<JSONWebToken> {
        await this.decoded.update(data)
        return this
    }
    /**
     * Async Deletes Token in DB (marks deleted)
     * 
     * @returns {Promise<any[]>} 
     * 
     * @memberof JSONWebToken
     */
    public async delete() {
        this.decoded.updated = new Date()
        this.decoded.canceled = true
        await this.decoded.delete()
        return this
    }
}

/**
 * UserJWT class assumes JWT instance comply with UserToken data
 * 
 * @export
 * @class UserJWT
 * @extends {JSONWebToken}
 */
export class UserJWT extends JSONWebToken {
    public decoded: UserToken
    public constructor(init: IToken) {
        super()
        this.audience = 'private:*'
        this.decoded = new UserToken(init)
    }
    /**
     * Async Creates new Token in DB in case
     * if there's a need to store new Token
     * In case the data provided ( user_id and some device_id or else)
     * will look up in DB for already created token and will skip creating new
     * Also the model will be adjusted to the one received from DB
     * Prevents massive creation of tokens for the user
     * TODO: maybe in future we can limit amount of tokens per user, ie 1 user upto 3 tokens or token per platofrom
     * @async
     */
    public saveWithTokenLookup(): Promise<JSONWebToken> {
        const query = QueryBuilder.table(Token.tableName)
            .where({ user_id: this.decoded.user_id, device: this.decoded.device, canceled: false, deleted: null })
            .orWhere({ user_id: this.decoded.user_id, device_id: this.decoded.device_id, canceled: false, deleted: null })
            .limit(1)
            .toString()
        return BaseModel.db.any(query).then((res: any[]) => {
            if (res.length === 0) return this.save()
            Object.assign(this.decoded, res[0])
            return this
        });
    }
}
/**
 * GuestJWT class assumes JWT instance comply with GuestToken data
 * 
 * @export
 * @class GuestJWT
 * @extends {JSONWebToken}
 */
export class GuestJWT extends JSONWebToken {
    public decoded: GuestToken

    public constructor(init: IToken) {
        super()
        this.audience = 'public:*'
        this.decoded = new GuestToken(init)
    }
    /**
     * Async Creates new Token in DB in case
     * if there's a need to store new Token
     * In case the data provided
     * will look up in DB for already created token and will skip creating new
     * Also the model will be adjusted to the one received from DB
     * Prevents massive creation of tokens for the user
     * TODO: maybe in future we can limit amount of tokens per user, ie 1 user upto 3 tokens or token per platofrom
     * @async
     */
    public saveWithTokenLookup(): Promise<JSONWebToken> {
        const query = QueryBuilder.table(Token.tableName)
            .where({ device: this.decoded.device, canceled: false, deleted: null })
            .orWhere({ device_id: this.decoded.device_id, canceled: false, deleted: null })
            .limit(1)
            .toString()
        return BaseModel.db.any(query).then((res: any[]) => {
            if (res.length === 0) return this.save()
            Object.assign(this.decoded, res[0])
            return this
        })
    }
}

export async function JwtResponse(user: User, options: IToken) {
    const jwt = new UserJWT(Object.assign({}, options, {
        user_id: user.id,
        permissions: user.user_roles
    }))
    await jwt.saveWithTokenLookup() //avoid token spaming in DB
    return { access_token: await jwt.encode('private:*'), user: new PublicUserModel(user) }
}