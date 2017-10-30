/**
 * IJWTData interface represents a structure of the decoded JWT with Header info
 */

import { Token } from "../../tokens/models/token.model";

export interface IJWTData {
    aud?: string
    iat?: number
    exp?: string|Date
    sub?: string
    data: Token
}