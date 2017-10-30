import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { IStatisticType } from "../interfaces/statistic_type.interface";

export class StatisticType extends BaseModel implements IStatisticType {
    public static tableName = "statistic_type";
    public id: number;
    public name: string;
    public sport_id: number;
    public order_id: number;

    constructor(data: IStatisticType) {
        super();
        this.id = data.id;
        this.name = data.name;
        this.sport_id = data.sport_id;
        this.order_id = data.order_id;
    }
}