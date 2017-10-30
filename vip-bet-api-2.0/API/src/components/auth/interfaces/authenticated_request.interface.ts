import { Request } from 'express'
import { JSONWebToken, GuestJWT, UserJWT } from "../models/jsonwebtoken.model";
export interface JWTRequest extends Request {
    query: {
        access_token?: string,
        [key: string]: any
    }
    body: {
        access_token?: string
        [key: string]: any
    }
    JWT: JSONWebToken
    
    params: {
        Authorization?: string
        [key: string]: any
    }
}
export interface GuestRequest extends JWTRequest{
    JWT: GuestJWT
}
export interface UserRequest extends JWTRequest{
    JWT: UserJWT
}
export interface AdminRequest extends JWTRequest{
    JWT: UserJWT
}