/**
 * Token interface represents a structure in DB
 */
export interface IToken{
    id?: number
    created?: Date
    expires?: Date
    updated?: Date
    canceled?: boolean
    device?: string
    device_id?: string 
    version?: string
    issuer?: string
    algorithms?: string
    user_id?: number
    permissions: string[]
    utm?: string
    referrer?: string
}