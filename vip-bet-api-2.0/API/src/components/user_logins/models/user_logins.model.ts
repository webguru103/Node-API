import { BaseModel, QueryBuilder } from "../../../../../CommonJS/src/base/base.model";
import { IUserLogin } from "../interfaces/user_logins.interface";

export class UserLogin extends BaseModel implements IUserLogin {
    public static tableName: string = "user_logins";
    public id?: number;
    public user_id: number;
    public date?: Date;
    public ip?: string;

    constructor(login: IUserLogin) {
        super();
        this.id = login.id;
        this.user_id = login.user_id;
        this.date = login.date;
        this.ip = login.ip;
    }

    public async getLast(): Promise<IUserLogin> {
        const query = QueryBuilder(UserLogin.tableName)
            .where("user_id", this.user_id)
            .orderBy("id", 'desc')
            .limit(1);

        return BaseModel.db.oneOrNone(query.toString());
    }
}