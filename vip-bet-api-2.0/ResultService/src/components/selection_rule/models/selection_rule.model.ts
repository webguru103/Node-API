import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { ISelectionRule } from "../interfaces/selection_rule.interface";

export class SelectionRule extends BaseModel implements ISelectionRule {
    public static tableName = "selection_rule";
    public id: number;
    public rule: string;
    public cancel_rule: string;
    public market_id: number;

    constructor(data: ISelectionRule) {
        super();
        this.id = data.id;
        this.rule = data.rule;
        this.cancel_rule = data.cancel_rule;
        this.market_id = data.market_id;
    }
}