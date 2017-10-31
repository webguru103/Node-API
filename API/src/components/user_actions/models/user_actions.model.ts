import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { IUserAction } from "../interfaces/user_actions.interface";

export class UserAction extends BaseModel implements IUserAction {
    public static tableName: string = "user_actions";
    public id?: number;
    public user_id: number;
    public date?: Date;
    public ip?: string;
    public action?: string;

    constructor(action: IUserAction) {
        super();
        this.id = action.id;
        this.user_id = action.user_id;
        this.date = action.date;
        this.ip = action.ip;
        this.action = action.action;
    }
}