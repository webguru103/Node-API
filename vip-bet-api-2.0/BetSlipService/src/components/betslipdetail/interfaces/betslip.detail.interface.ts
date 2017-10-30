import { ResultType } from "../../../../../MarketService/src/components/selections/enums/result_type.enum";
import { IBase } from "../../../../../CommonJS/src/base/base.interface";
import { BetSlipStatus } from "../../betslip/enums/betslip_status.enum";

export interface IBetSlipDetail extends IBase {
    id: number;
    betslip_id: number;
    event_id: number;
    event_name: string;
    event_market_id: number;
    event_selection_id: number;
    market_id: number;
    market_name: string;
    selection_id: number;
    selection_name: string;
    sport_id: number;
    sport_name: string;
    country_id: number;
    country_name: string;
    league_id: number;
    league_name: string;
    is_lobby: boolean;
    group: number;
    odd: number;
    status_id: BetSlipStatus;
    provider_id: number;
    result_type_id: ResultType;
}

export interface IBetSlipDetailUpdate extends IBase {
    id: number;
    status_id: BetSlipStatus;
}
