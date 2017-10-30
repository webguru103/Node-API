import { NormalizeLimit, NormalizeOffset } from "../../../../../CommonJS/src/utils/utils";
import { BetSlip } from "../models/betslip.model";
import { QueryBuilder, BaseModel, broker } from "../../../../../CommonJS/src/base/base.model";
import { MIN_DATE, MAX_DATE } from "../../../../../CommonJS/src/domain/constant";
import { IBetSlip } from "../interfaces/betslip.interface";
import { map, reduce } from "bluebird";
import { isString, uniq, uniqBy, sortBy, intersection } from "lodash";
import { BetSlipDetailFilter } from "../../betslipdetail/filters/betslip.detail.filter";
import { BetSlipStatus } from "../enums/betslip_status.enum";
import { BetSlipType } from "../enums/betslip_type.enum";
import { QueueType } from "../../../../../CommonJS/src/messaging/QueueType";
import { CommunicationCodes } from "../../../../../CommonJS/src/messaging/CommunicationCodes";
import { IEvent } from "../../../../../EventService/src/components/events/interfaces/event.interface";

export class BetSlipFilter {
    public id?: number;
    public ids?: number[];
    public user_id?: number;
    public place_date_from: Date;
    public place_date_to: Date;
    public money_type?: number;
    public status_id?: BetSlipStatus;
    public amount?: number;
    public won_amount?: number;
    public possible_won_amount?: number;
    public type_id?: BetSlipType;
    public awaiting_result?: boolean;
    public page: number;
    public limit: number;

    constructor(filter: Partial<BetSlipFilter>) {
        this.id = filter.id;
        this.ids = filter.ids;
        this.user_id = filter.user_id;
        this.place_date_from = filter.place_date_from || MIN_DATE;
        this.place_date_to = filter.place_date_to || MAX_DATE;
        this.money_type = filter.money_type;
        this.status_id = filter.status_id;
        this.amount = filter.amount;
        this.won_amount = filter.won_amount;
        this.possible_won_amount = filter.possible_won_amount;
        this.type_id = filter.type_id;
        this.awaiting_result = isString(filter.awaiting_result) ? JSON.parse(filter.awaiting_result) : filter.awaiting_result;
        this.page = NormalizeOffset((filter.page || 1) - 1);
        this.limit = NormalizeLimit(filter.limit || 20);
    }

    public async find(): Promise<IBetSlip[]> {
        return this._find(this.page, this.limit);;
    }

    private async _find(page: number, limit: number, result: IBetSlip[] = []): Promise<IBetSlip[]> {
        const query = QueryBuilder
            .table(BetSlip.tableName)
            .whereBetween("place_date", [this.place_date_from, this.place_date_to])
            .limit(limit)
            .offset(page * limit)
            .orderBy("place_date")
            .select("*")
            .select(QueryBuilder.raw('count(*) OVER() AS full_count'));

        if (this.id) query.where("id", this.id);
        if (this.ids) query.whereIn("id", this.ids);
        if (this.user_id) query.where("user_id", this.user_id);
        if (this.money_type) query.where("money_type", this.money_type);
        // if awaiting result take only active bets
        if (this.awaiting_result) this.status_id = BetSlipStatus.ACTIVE;
        else if (this.status_id) query.where("status_id", this.status_id);
        // 
        if (this.amount) query.where("amount", this.amount);
        if (this.won_amount) query.where("won_amount", this.won_amount);
        if (this.possible_won_amount) query.where("possible_won_amount", this.possible_won_amount);
        if (this.type_id) query.where("type_id", this.type_id);
        // execute query
        const queryString = query.toString();
        const output = <IBetSlip[]>await BaseModel.db.manyOrNone(queryString);
        // collect event ids
        let eventIds: number[] = [];
        // betlsips
        let betslips: IBetSlip[] = await map(output, async slip => {
            const betslip = new BetSlip(slip);
            // find betslip details
            const betslipDetailsFilter = new BetSlipDetailFilter({ betslip_id: betslip.id });
            // if awaiting result take only active details
            if (this.awaiting_result) {
                betslipDetailsFilter.status_id = BetSlipStatus.ACTIVE;
            }
            // assign betslip details
            betslip.details = await betslipDetailsFilter.find();
            // save event ids
            eventIds = eventIds.concat(betslip.details.map(d => d.event_id));
            // return betslip
            return betslip;
        });
        // if not asking awaiting result bets return current betslips
        // or there is no more betslips return what exists 
        if (!this.awaiting_result) return betslips;
        if (betslips.length === 0) return result;
        // get events
        const events: IEvent[] = await broker.sendRequest(CommunicationCodes.GET_EVENTS, {
            ids: uniq(eventIds),
            is_finished: true,
            include_market_counts: false,
            include_category_names: false
        }, QueueType.EVENT_SERVICE);
        // take betslips only for which events are ready for result
        betslips = await reduce(betslips, async (result: IBetSlip[], betslip) => {
            const betslipEventIds = betslip.details.map(d => d.event_id);
            const eIds = events.map(ev => ev.id);
            if (intersection(betslipEventIds, eIds).length > 0) {
                result.push(betslip);
            }
            return result;
        }, []);
        betslips = uniqBy(betslips, "id");
        // push betlsips to result list
        result = result.concat(betslips);
        result = result.slice(0, limit);
        result = sortBy(result, "place_date");
        // if not enough bets get more
        page++;
        if (result.length != limit) return this._find(page, limit, result);
        // return result
        return result;
    }
}