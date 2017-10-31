import { IBase } from "../../../../../CommonJS/src/base/base.interface";

export interface IScope extends IBase {
    id: number;
    name: string;
    sport_id: number;
    order_id: number;
}