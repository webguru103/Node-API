import { BetSlipDetail } from "../../betslipdetail/models/betslipdetail.model";
import { BaseModel, broker } from "../../../../../CommonJS/src/base/base.model";
import { CommunicationCodes } from "../../../../../CommonJS/src/messaging/CommunicationCodes";
import { map } from "bluebird";
import { IBetSlipDetail } from "../../betslipdetail/interfaces/betslip.detail.interface";
import { IBetSlip } from "../interfaces/betslip.interface";
import { QueueType } from "../../../../../CommonJS/src/messaging/QueueType";
import { ErrorUtil, ErrorCodes } from "../../../../../CommonJS/src/messaging/ErrorCodes";
import { IEvent } from "../../../../../EventService/src/components/events/interfaces/event.interface";
import { isNumber } from "util";
import { IEventMarket } from "../../../../../EventMarketService/src/components/event.market/interfaces/event.market.interface";
import { IEventSelectionPublic } from "../../../../../EventMarketService/src/components/event.selection/interfaces/event.selection.interface";
import { IMarket } from "../../../../../MarketService/src/components/markets/interfaces/market.interface";
import { ICategory } from "../../../../../CategoryService/src/components/category/interfaces/category.interface";
import { merge, round } from "lodash";
import { BetSlipStatus } from "../enums/betslip_status.enum";
import { BetSlipType } from "../enums/betslip_type.enum";
import { CategoryType } from "../../../../../CategoryService/src/components/category/enums/category_type.enum";
import { CategoryStatus } from "../../../../../CategoryService/src/components/category/enums/category_status.enum";
import { MarketStatus } from "../../../../../MarketService/src/components/markets/enums/market_status.enum";
import { EventStatus } from "../../../../../EventService/src/components/events/enums/event_status.enum";
import { ResultType } from "../../../../../MarketService/src/components/selections/enums/result_type.enum";
import { BetSlipDetailFilter } from "../../betslipdetail/filters/betslip.detail.filter";

export class BetSlip extends BaseModel implements IBetSlip {
    public static tableName: string = "betslip";
    public id: number;
    public user_id: number;
    public place_date?: Date;
    public money_type: number;
    public status_id: BetSlipStatus;
    public amount: number;
    public won_amount: number;
    public possible_won_amount: number;
    public type_id?: BetSlipType;
    public details: IBetSlipDetail[];
    public title: string;
    public description: string;
    public full_count: number;
    private verified: boolean;

    constructor(betSlip: IBetSlip) {
        super();
        this.id = betSlip.id;
        this.user_id = betSlip.user_id;
        this.place_date = betSlip.place_date;
        this.money_type = betSlip.money_type;
        this.status_id = betSlip.status_id;
        this.title = betSlip.title;
        this.description = betSlip.description;
        this.amount = Number(betSlip.amount) || 0;
        this.details = betSlip.details ? betSlip.details.map(detail => { return new BetSlipDetail(detail) }) : [];
        this.type_id = betSlip.type_id;
        // 
        this.won_amount = betSlip.won_amount;
        this.possible_won_amount = this.possible_won_amount;
        this.full_count = betSlip.full_count;
    }

    public async saveWithID(): Promise<IBetSlip> {
        // verify betslip
        await this.verify();
        // copy details to temp list
        // save betslip
        const saved = await new BetSlipSaveModel(this);
        await saved.saveWithID();
        this.id = saved.id;
        // save details
        this.details = await map(this.details, async detail => {
            // set betslips id to detail
            detail.betslip_id = this.id;
            // save detail
            return (<BetSlipDetail>detail).saveWithID();
        }, { concurrency: this.details.length });
        // return saved betslip
        return this;
    }

    public async update(data: any = this, byFields: any = { id: this.id }): Promise<any> {
        // store for details calculation
        const oldStatus = this.status_id;
        const newStatus = data.status_id;
        // merge properties
        merge(this, data);
        // update status
        await new BetSlipSaveModel(this).update();
        // update details only when betslip became cancelled or from cancelled became some other status
        if (oldStatus !== newStatus && (oldStatus === BetSlipStatus.CANCELLED || newStatus === BetSlipStatus.CANCELLED)) {
            if (this.details.length === 0) this.details = await new BetSlipDetailFilter({ betslip_id: this.id }).find();
            this.details = await map(this.details, async detail => {
                detail.status_id = BetSlipStatus.ACTIVE;
                return detail.update();
            });
        }
        // 
        if (this.details.every(d => d.status_id === BetSlipStatus.CANCELLED) || this.details.every(d => d.result_type_id === ResultType.CANCEL)) {
            this.status_id = BetSlipStatus.CANCELLED;
            this.won_amount = this.amount;
            this.possible_won_amount = 0;
        }
        else if (this.details.every(d => d.result_type_id === ResultType.WIN)) {
            this.status_id = BetSlipStatus.WIN;
            this.won_amount = round(this.amount * this.details
                .map(d => d.status_id === BetSlipStatus.CANCELLED ? 1 : d.odd)
                .reduce((prev, next) => prev * next, 1), 2);
            this.possible_won_amount = 0;
        }
        else if (this.details.find(d => d.result_type_id === ResultType.LOST)) {
            this.status_id = BetSlipStatus.LOST;
            this.won_amount = 0;
            this.possible_won_amount = 0;
        }
        else {
            this.status_id = BetSlipStatus.ACTIVE;
            this.won_amount = 0;
            this.possible_won_amount = round(this.amount * this.details.map(d => d.odd).reduce((prev, next) => prev * next, 1), 2);
        };
        await new BetSlipSaveModel(this).update();
        return this;
    }

    // verify betslip
    public async verify(): Promise<any> {
        if (this.verified) return;
        // verify general data
        await this.verifyBetSlip();
        // verify details
        this.details = await this.verifyDetails();
        // set verified true to not verify over and over again
        this.verified = true;
    }
    // verify betslip
    private async verifyBetSlip(): Promise<any> {
        //  check amoung
        if (!isNumber(this.amount) || this.amount < 0) throw ErrorUtil.newError(ErrorCodes.INCORRECT_AMOUNT);
    }
    // verify betslip details
    private async verifyDetails(): Promise<IBetSlipDetail[]> {
        return map(this.details, async detail => {
            if (detail.odd <= 1) throw ErrorUtil.newError(ErrorCodes.EVENT_SELECTION_ODD_RESTRICTION, "odd cannot be less or equal to 1.00");
            // get event selection
            const eventSelection: IEventSelectionPublic = await broker.sendRequest(CommunicationCodes.GET_EVENT_SELECTION, { id: detail.event_selection_id }, QueueType.EVENT_MARKET_SERVICE);
            // if event selection not found return error
            if (!eventSelection) throw ErrorUtil.newError(ErrorCodes.EVENT_SELECTION_NOT_FOUND);
            if (eventSelection.status_id !== EventStatus.ACTIVE) throw ErrorUtil.newError(ErrorCodes.EVENT_SELECTION_IS_NOT_ACTIVE);
            detail.selection_name = <string>eventSelection.name;

            // get selection
            const selection = await broker.sendRequest(CommunicationCodes.GET_SELECTION, { id: eventSelection.selection_id }, QueueType.MARKET_SERVICE);
            // if selection not found return error
            if (!selection) throw ErrorUtil.newError(ErrorCodes.SELECTION_DOES_NOT_EXISTS);
            detail.selection_id = selection.id;

            // get event market
            const eventMarket: IEventMarket = await broker.sendRequest(CommunicationCodes.GET_EVENT_MARKET, { id: eventSelection.event_market_id }, QueueType.EVENT_MARKET_SERVICE);
            // if event market not found return error
            if (!eventMarket) throw ErrorUtil.newError(ErrorCodes.EVENT_MARKET_NOT_FOUND);
            if (eventMarket.status_id !== EventStatus.ACTIVE) throw ErrorUtil.newError(ErrorCodes.EVENT_MARKET_IS_NOT_ACTIVE);
            detail.event_market_id = eventMarket.id;

            // get market
            const market: IMarket = await broker.sendRequest(CommunicationCodes.GET_MARKET, { id: eventMarket.market_id }, QueueType.MARKET_SERVICE);
            // if market does not exist throw error
            if (!market) throw ErrorUtil.newError(ErrorCodes.MARKET_DOES_NOT_EXISTS);
            if (market.status_id !== MarketStatus.ACTIVE) throw ErrorUtil.newError(ErrorCodes.MARKET_IS_NOT_ACTIVE);
            detail.market_name = market.name;
            detail.market_id = market.id;

            // get event
            const event: IEvent = await broker.sendRequest(CommunicationCodes.GET_EVENT, { id: eventMarket.event_id }, QueueType.EVENT_SERVICE);
            // if event not found return error
            if (!event) throw ErrorUtil.newError(ErrorCodes.EVENT_NOT_FOUND);
            if (event.status !== EventStatus.ACTIVE) throw ErrorUtil.newError(ErrorCodes.EVENT_IS_NOT_ACTIVE);
            detail.event_name = event.name;
            detail.event_id = event.id;

            // get sport
            const sport: ICategory = await broker.sendRequest(CommunicationCodes.GET_CATEGORY, { id: event.sport_id, type_id: CategoryType.SPORT }, QueueType.CATEGORY_SERVICE);
            // if sport not found return error
            if (!sport) throw ErrorUtil.newError(ErrorCodes.SPORT_NOT_FOUND);
            if (sport.status_id !== CategoryStatus.ACTIVE) throw ErrorUtil.newError(ErrorCodes.SPORT_IS_NOT_ACTIVE);
            detail.sport_name = <string>sport.name;
            detail.sport_id = sport.id;

            // get country
            const country: ICategory = await broker.sendRequest(CommunicationCodes.GET_CATEGORY, { id: event.country_id, type_id: CategoryType.SPORT_COUNTRY }, QueueType.CATEGORY_SERVICE);
            // if country not found return error
            if (!country) throw ErrorUtil.newError(ErrorCodes.COUNTRY_NOT_FOUND);
            if (country.status_id !== CategoryStatus.ACTIVE) throw ErrorUtil.newError(ErrorCodes.COUNTRY_IS_NOT_ACTIVE);
            detail.country_name = <string>country.name;
            detail.country_id = country.id;

            // get league
            const league: ICategory = await broker.sendRequest(CommunicationCodes.GET_CATEGORY, { id: event.league_id, type_id: CategoryType.LEAGUE }, QueueType.CATEGORY_SERVICE);
            // if league not found return error
            if (!league) throw ErrorUtil.newError(ErrorCodes.LEAGUE_NOT_FOUND);
            if (league.status_id !== CategoryStatus.ACTIVE) throw ErrorUtil.newError(ErrorCodes.LEAGUE_IS_NOT_ACTIVE);
            detail.league_name = <string>league.name;
            detail.league_id = league.id;

            return detail;

        }, { concurrency: this.details.length });

    }
}

export class BetSlipSaveModel extends BaseModel {
    public static tableName = "betslip";
    public id: number;
    public user_id: number;
    public place_date?: Date;
    public money_type: number;
    public status_id: BetSlipStatus;
    public amount: number;
    public won_amount: number;
    public possible_won_amount: number;
    public type_id?: BetSlipType;
    public title: string;
    public description: string;

    constructor(betSlip: IBetSlip) {
        super();
        this.id = betSlip.id;
        this.user_id = betSlip.user_id;
        this.place_date = betSlip.place_date;
        this.money_type = betSlip.money_type;
        this.status_id = betSlip.status_id;
        this.title = betSlip.title;
        this.description = betSlip.description;
        this.amount = Number(betSlip.amount) || 0;
        this.won_amount = betSlip.won_amount;
        this.type_id = betSlip.type_id;
        this.possible_won_amount = this.possible_won_amount;
    }
}