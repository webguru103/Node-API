import { QueryBuilder, BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { User, PublicUserModel } from "../models/user.model";
import { NormalizeOffset, NormalizeLimit } from "../../../../../CommonJS/src/utils/utils";
import { IPublicUser, IUser } from "../interfaces/user.interface";
import { UserStatus } from "../enums/user.status.enum";
import { MIN_DATE, MAX_DATE } from "../../../../../CommonJS/src/domain/constant";
import { map } from "bluebird";
import { isString } from "lodash";

export class UserFilter {
    public id?: number;
    public username?: string;
    public first_name?: string;
    public last_name?: string;
    public email?: string;
    public date_from: Date;
    public date_to: Date;
    public status_id?: UserStatus;
    public user_roles?: string[];
    public wordpress_id?: string;
    public wordpress_username?: string;
    public limit: number;
    public page: number;

    constructor(filter: Partial<UserFilter>) {
        this.id = filter.id;
        this.username = filter.username;
        this.first_name = filter.first_name;
        this.last_name = filter.last_name;
        this.email = filter.email;
        this.status_id = filter.status_id;
        this.date_from = filter.date_from || MIN_DATE;
        this.date_to = filter.date_to || MAX_DATE;
        if (isString(filter.user_roles)) this.user_roles = [filter.user_roles];
        else this.user_roles = filter.user_roles;
        this.wordpress_id = filter.wordpress_id;
        this.wordpress_username = filter.wordpress_username;
        this.page = NormalizeOffset((filter.page || 1) - 1);
        this.limit = NormalizeLimit(filter.limit);
    }

    public async find(): Promise<IPublicUser[]> {
        const query = QueryBuilder
            .table(User.tableName)
            .whereBetween("created", [this.date_from, this.date_to])
            .limit(this.limit)
            .offset(this.page * this.limit)
            .select('*')
            .select(QueryBuilder.raw(`count(*) OVER() AS full_count`))
        if (this.id) query.where("id", this.id);
        if (this.username) query.whereRaw(`username ilike '%${this.username}%'`);
        if (this.first_name) query.whereRaw(`first_name ilike '%${this.first_name}%'`);
        if (this.last_name) query.whereRaw(`last_namе ilike '%${this.last_name}%'`);
        if (this.email) query.whereRaw(`email ilike '%${this.email}%'`);
        if (this.wordpress_id) query.where("wordpress_id", this.wordpress_id);
        if (this.wordpress_username) query.whereRaw(`wordpress_username ilike '%${this.wordpress_username}%'`);
        if (this.status_id) query.where("status_id", this.status_id);
        if (this.user_roles) query.whereRaw(`user_roles @> ARRAY[` + this.user_roles.map(r => "'" + r + "'").join(`,`) + `]::varchar[]`);
        // execute query
        const queryString = query.toString();
        const result = <IUser[]>await BaseModel.db.manyOrNone(queryString);
        const users = await map(result, async r => new PublicUserModel(r));
        await map(users, async user => user.getLastLogin());
        return users;
    }
}