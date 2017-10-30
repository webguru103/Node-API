
import { IUserPermissions } from "../../user_roles/interfaces/user_permissions.interface";
import { UserStatus } from "../enums/user.status.enum";

export interface IUser {
    id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password_hash?: string;
    salt: string;
    facebook_id?: string;
    facebook_token?: string;
    facebook_permissions?: string[];
    twitter_token?: string;
    user_roles: IUserPermissions;
    avatar?: string;
    verification_photo?: string;
    linkedin_token?: string;
    linkedin_id?: string;
    state_id?: string;
    state_id_issue_date?: Date;
    country?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    address?: string;
    phone?: string;
    gender?: string;
    birth?: Date;
    utm?: string;
    referrer?: string;
    campaign?: string;
    wordpress_id?: string;
    wordpress_username?: string;
    wordpress_token?: string;
    status_id?: UserStatus;
    full_count?:number;
    created?: Date;
    updated?: Date;
    deleted?: Date;
}

export interface IPublicUser {
    id?: number
    username?: string
    first_name?: string
    last_name?: string
    email?: string
    facebook_connected?: boolean
    linkedin_connected?: boolean
    avatar?: string;
    verification_photo?: string;
    state_id?: string;
    state_id_issue_date?: Date;
    country?: string;
    city?: string;
    address?: string;
    phone?: string;
    gender?: string;
    birth?: Date;
    user_roles: IUserPermissions;
    facebook_id?: string;
    linkedin_id?: string;
    utm?: string;
    referrer?: string;
    is_verified: boolean,
    created?: Date
    status_id?: UserStatus,
    full_count?: number,
    wordpress_id?: string,
    wordpress_username?: string
}