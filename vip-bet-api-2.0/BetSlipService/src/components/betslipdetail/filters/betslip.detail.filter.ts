import { IBetSlipDetail } from "../interfaces/betslip.detail.interface";
import { BetSlipDetail } from "../models/betslipdetail.model";
import { QueryBuilder, BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { BetSlipStatus } from "../../betslip/enums/betslip_status.enum";

export class BetSlipDetailFilter {
    public id?: number;
    public betslip_id?: number;
    public event_selection_id?: number;
    public event_selection_ids?: number[];
    public event_id?: number;
    public sport_id?: number;
    public country_id?: number;
    public league_id?: number;
    public status_id?: BetSlipStatus;
    public provider_id?: number;

    constructor(filter: Partial<BetSlipDetailFilter>) {
        this.id = filter.id;
        this.betslip_id = filter.betslip_id;
        this.event_selection_id = filter.event_selection_id;
        this.event_selection_ids = filter.event_selection_ids;
        this.event_id = filter.event_id;
        this.sport_id = filter.sport_id;
        this.country_id = filter.country_id;
        this.league_id = filter.league_id;
        this.status_id = filter.status_id;
        this.provider_id = filter.provider_id;
    }

    public async find(): Promise<IBetSlipDetail[]> {
        const query = QueryBuilder(BetSlipDetail.tableName).orderBy("id");
        if (this.id) query.where("id", this.id);
        if (this.betslip_id) query.where("betslip_id", this.betslip_id);
        if (this.event_selection_id) query.where("event_selection_id", this.event_selection_id);
        if (this.event_selection_ids) query.whereIn("event_selection_id", this.event_selection_ids);
        if (this.event_id) query.where("event_id", this.event_id);
        if (this.sport_id) query.where("sport_id", this.sport_id);
        if (this.country_id) query.where("country_id", this.country_id);
        if (this.league_id) query.where("league_id", this.league_id);
        if (this.status_id) query.where("status_id", this.status_id);
        if (this.provider_id) query.where("provider_id", this.provider_id);

        const queryString = query.toString();
        const result = await BaseModel.db.manyOrNone(queryString);
        return result.map(b => new BetSlipDetail(b));
    }
}