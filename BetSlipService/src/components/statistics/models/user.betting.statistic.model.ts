import { IUserBettingStatistics } from "../interfaces/user.betting.statistic.interface";

export class UserBettingStatistics implements IUserBettingStatistics {
    public user_id: number;
    public roi: number;
    public total_count: number;
    public money_type: number;
    public single_count: number;
    public express_count: number;
    public system_count: number;
    public placed_total: number;

    public lost_amount: number;
    public lost_avg_odd: number;
    public lost_count: number;
    public lost_max_odd: number;
    public lost_min_odd: number;
    public lost_max: number;
    public lost_min: number;

    public won_amount: number;
    public won_avg_odd: number;
    public won_count: number;
    public won_max_odd: number;
    public won_min_odd: number;
    public won_max: number;
    public won_min: number;

    public active_amount: number;
    public active_avg_odd: number;
    public active_count: number;
    public active_max_odd: number;
    public active_min_odd: number;
    public active_max: number;
    public active_min: number;

    public max_odd: number;
    public min_odd: number;
    public avg_odd: number;
    public yield: number;

    constructor(data: IUserBettingStatistics) {
        this.user_id = data.user_id;
        this.roi = data.roi || 0;
        this.total_count = data.total_count || 0;
        this.money_type = data.money_type || 0;
        this.single_count = data.single_count || 0;
        this.express_count = data.express_count || 0;
        this.system_count = data.system_count || 0;
        this.placed_total = data.placed_total || 0;

        this.lost_amount = data.lost_amount || 0;
        this.lost_avg_odd = data.lost_avg_odd || 0;
        this.lost_count = data.lost_count || 0;
        this.lost_max = data.lost_max || 0;
        this.lost_max_odd = data.lost_max_odd || 0;
        this.lost_min = data.lost_min || 0;
        this.lost_min_odd = data.lost_min_odd || 0;

        this.won_amount = data.won_amount || 0;
        this.won_avg_odd = data.won_avg_odd || 0;
        this.won_count = data.won_count || 0;
        this.won_max = data.won_max || 0;
        this.won_max_odd = data.won_max_odd || 0;
        this.won_min = data.won_min || 0;
        this.won_min_odd = data.won_min_odd || 0;

        this.active_amount = data.active_amount || 0;
        this.active_avg_odd = data.active_avg_odd || 0;
        this.active_count = data.active_count || 0;
        this.active_max = data.active_max || 0;
        this.active_max_odd = data.active_max_odd || 0;
        this.active_min = data.active_min || 0;
        this.active_min_odd = data.active_min_odd || 0;

        this.max_odd = data.max_odd || 0;
        this.min_odd = data.min_odd || 0;
        this.avg_odd = data.avg_odd || 0;
        this.yield = data.yield || 0;
    }
}

export class UserBettingObject {
    public id: number;
    public name: string;
    public yield: number

    constructor(data: UserBettingObject) {
        this.id = data.id;
        this.name = data.name;
        this.yield = data.yield;
    }
}