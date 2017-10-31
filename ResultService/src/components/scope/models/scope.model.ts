import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { IScope } from "../interfaces/scope.interface";

export class Scope extends BaseModel implements IScope {
    public static tableName = "scope";
    public id: number;
    public name: string;
    public sport_id: number;
    public order_id: number;

    constructor(data: IScope) {
        super();
        this.id = data.id;
        this.name = data.name;
        this.sport_id = data.sport_id;
        this.order_id = data.order_id;
    }
}