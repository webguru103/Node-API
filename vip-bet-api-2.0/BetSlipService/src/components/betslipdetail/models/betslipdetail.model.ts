import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { IBetSlipDetail, IBetSlipDetailUpdate } from "../interfaces/betslip.detail.interface";
import { ResultType } from "../../../../../MarketService/src/components/selections/enums/result_type.enum";
import { BetSlipStatus } from "../../betslip/enums/betslip_status.enum";
import { BetSlipFilter } from "../../betslip/filters/betslip.filter";
import { ErrorUtil } from "../../../../../CommonJS/src/messaging/ErrorCodes";

export class BetSlipDetail extends BaseModel implements IBetSlipDetail {
    public static tableName = 'betslip_detail';
    public id: number;
    public betslip_id: number;
    public event_id: number;
    public event_name: string;
    public event_market_id: number;
    public event_selection_id: number;
    public market_id: number;
    public market_name: string;
    public selection_id: number;
    public selection_name: string;
    public sport_id: number;
    public sport_name: string;
    public country_id: number;
    public country_name: string;
    public league_id: number;
    public league_name: string;
    public is_lobby: boolean;
    public group: number;
    public odd: number;
    public status_id: BetSlipStatus;
    public provider_id: number;
    public result_type_id: ResultType;

    constructor(detail: IBetSlipDetail) {
        super();
        this.id = detail.id;
        this.betslip_id = detail.betslip_id;
        this.event_id = detail.event_id;
        this.event_name = detail.event_name;
        this.event_market_id = detail.event_market_id;
        this.event_selection_id = detail.event_selection_id;
        this.market_id = detail.market_id;
        this.market_name = detail.market_name;
        this.selection_id = detail.selection_id;
        this.selection_name = detail.selection_name;
        this.sport_id = detail.sport_id;
        this.sport_name = detail.sport_name;
        this.country_id = detail.country_id;
        this.country_name = detail.country_name;
        this.league_id = detail.league_id;
        this.league_name = detail.league_name;
        this.is_lobby = detail.is_lobby;
        this.group = detail.group;
        this.odd = Number(detail.odd) || 0;
        this.status_id = detail.status_id;
        this.provider_id = detail.provider_id;
        this.result_type_id = detail.result_type_id;
    }
    public async update(data: any = this, byFields: any = { id: this.id }): Promise<any> {
        const [betslip] = await new BetSlipFilter({ id: this.betslip_id }).find();
        if (!betslip) throw ErrorUtil.newError(`betslip ${this.betslip_id} not found`);
        // if betslip cancelled details status should be also cancelled
        if (betslip.status_id === BetSlipStatus.CANCELLED) this.status_id = BetSlipStatus.CANCELLED;
        // if betslip is not cancelled check statuses
        if (this.status_id !== BetSlipStatus.CANCELLED) {
            switch (this.result_type_id) {
                case ResultType.WIN:
                    this.status_id = BetSlipStatus.WIN;
                    break;
                case ResultType.LOST:
                    this.status_id = BetSlipStatus.LOST;
                    break;
                case ResultType.CANCEL:
                    this.status_id = BetSlipStatus.CANCELLED;
                    break;
                default:
                    this.status_id = BetSlipStatus.ACTIVE;
            };
        }
        return super.update(data, byFields);
    }
}

export class BetSlipDetailUpdate extends BaseModel implements IBetSlipDetailUpdate {
    public static tableName = 'betslip_detail';
    public id: number;
    public status_id: BetSlipStatus;

    constructor(detail: IBetSlipDetail) {
        super();
        this.id = detail.id;
        this.status_id = detail.status_id;
    }
}