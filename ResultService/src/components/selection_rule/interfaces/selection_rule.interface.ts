import { IBase } from "../../../../../CommonJS/src/base/base.interface";

export interface ISelectionRule extends IBase {
    id: number;
    rule: string;
    cancel_rule: string;
    market_id: number;
}