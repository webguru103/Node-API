import { IBetSlipDetail } from "../../betslipdetail/interfaces/betslip.detail.interface";
import { IBase } from "../../../../../CommonJS/src/base/base.interface";
import { BetSlipMoneyType } from "../enums/betslip_money_type.enum";
import { BetSlipStatus } from "../enums/betslip_status.enum";
import { BetSlipType } from "../enums/betslip_type.enum";

export interface IBetSlip extends IBase {
    id: number;
    user_id: number;
    place_date?: Date;
    money_type: BetSlipMoneyType;
    status_id: BetSlipStatus;
    amount: number;
    won_amount: number;
    possible_won_amount: number;
    type_id?: BetSlipType;
    details: IBetSlipDetail[];
    title: string;
    description: string;
    full_count: number;
}