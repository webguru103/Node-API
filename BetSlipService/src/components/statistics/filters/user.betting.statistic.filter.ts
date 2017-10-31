import { NormalizePage, NormalizeLimit } from "../../../../../CommonJS/src/utils/utils";
import { QueryBuilder, broker } from "../../../../../CommonJS/src/base/base.model";
import { MIN_DATE, MAX_DATE, DEFAULT_LANGUAGE } from "../../../../../CommonJS/src/domain/constant";
import { BetSlipDetail } from "../../betslipdetail/models/betslipdetail.model";
import { each, map } from "bluebird";
import { groupBy, max, min, sumBy, toNumber, round } from "lodash";
import { BetSlip } from "../../betslip/models/betslip.model";
import { IBetSlip } from "../../betslip/interfaces/betslip.interface";
import { UserBettingStatistics, UserBettingObject } from "../models/user.betting.statistic.model";
import { QueueType } from "../../../../../CommonJS/src/messaging/QueueType";
import { CommunicationCodes } from "../../../../../CommonJS/src/messaging/CommunicationCodes";
import { IBetSlipDetail } from "../../betslipdetail/interfaces/betslip.detail.interface";
import { StatisticGroup } from "../enums/statistics_group.enum";
import { BetSlipType } from "../../betslip/enums/betslip_type.enum";
import { BetSlipStatus } from "../../betslip/enums/betslip_status.enum";
export class UserBettingStatisticFilter {
    public user_id?: number;
    public date_from: Date;
    public date_to: Date;
    public money_type?: number;
    public type_id?: BetSlipType;
    public sport_id?: number;
    public country_id?: number;
    public league_id?: number;
    public event_id?: number;
    public market_id?: number;
    public selection_id?: number;
    public group_by?: string;
    public lang_id?: number;
    public page: number;
    public limit: number;

    constructor(filter: Partial<UserBettingStatisticFilter>) {
        this.user_id = filter.user_id;
        this.date_from = filter.date_from || MIN_DATE;
        this.date_to = filter.date_to || MAX_DATE;
        this.money_type = filter.money_type;
        this.type_id = filter.type_id;
        this.sport_id = filter.sport_id;
        this.country_id = filter.country_id;
        this.league_id = filter.league_id;
        this.event_id = filter.event_id;
        this.market_id = filter.market_id;
        this.selection_id = filter.selection_id;
        this.group_by = filter.group_by;
        this.lang_id = filter.lang_id || DEFAULT_LANGUAGE;
        this.page = NormalizePage((filter.page || 1) - 1);
        this.limit = NormalizeLimit(filter.limit || 20);
    }

    public async findSports(): Promise<UserBettingObject[]> {
        if (this.group_by === undefined) throw new Error("group_by should be provided");
        if (!["sport", "country", "league", "market", "provider"].includes(this.group_by)) throw new Error("group_by is wrong");

        const query = QueryBuilder(BetSlip.tableName)
            .join(BetSlipDetail.tableName, function () {
                this.on(BetSlip.tableName + ".id", "=", BetSlipDetail.tableName + ".betslip_id")
            })
            .whereBetween(BetSlip.tableName + ".place_date", [this.date_from, this.date_to])
            .select(BetSlip.tableName + ".status_id")
            .select(BetSlip.tableName + ".won_amount")
            .select(BetSlip.tableName + ".amount")
            .select(BetSlipDetail.tableName + ".sport_id")
            .select(BetSlipDetail.tableName + ".country_id")
            .select(BetSlipDetail.tableName + ".league_id")
            .select(BetSlipDetail.tableName + ".market_id")
            .select(BetSlipDetail.tableName + ".provider_id")
            .select(BetSlipDetail.tableName + ".odd")

        if (this.user_id) query.andWhere(BetSlip.tableName + ".user_id", "=", this.user_id)
        if (this.sport_id) query.andWhere(BetSlipDetail.tableName + ".sport_id", "=", this.sport_id);
        if (this.country_id) query.andWhere(BetSlipDetail.tableName + ".country_id", "=", this.country_id);
        if (this.league_id) query.andWhere(BetSlipDetail.tableName + ".league_id", "=", this.league_id);
        if (this.event_id) query.andWhere(BetSlipDetail.tableName + ".event_id", "=", this.event_id);
        if (this.market_id) query.andWhere(BetSlipDetail.tableName + ".market_id", "=", this.market_id);
        if (this.selection_id) query.andWhere(BetSlipDetail.tableName + ".selection_id", "=", this.selection_id);

        const queryString = query.toString();
        const result = await BetSlip.db.manyOrNone(queryString);

        await map(result, async (bet: any) => {
            bet.amount = toNumber(bet.amount);
            bet.won_amount = toNumber(bet.won_amount);
            bet.odd = toNumber(bet.odd);
        });

        const groupedDetails = groupBy(result, `${this.group_by}_id`);
        // get and return
        const stats = await this.getStatNames(Object.keys(groupedDetails), this.group_by);
        if (!stats) return [];
        return map(stats, async stat => {
            const userBettingObject = new UserBettingObject(stat);
            // calculate yield
            const wonBets = groupedDetails[stat.id].filter((b: any) => b.status_id == BetSlipStatus.WIN || b.status_id == BetSlipStatus.HALF_WIN);
            const lostBets = groupedDetails[stat.id].filter((b: any) => b.status_id == BetSlipStatus.LOST);
            const wonAmount = sumBy(wonBets, "won_amount");
            const lostAmount = sumBy(lostBets, "amount");
            userBettingObject.yield = round(((wonAmount / (wonAmount + lostAmount)) - 1) * 100 || 0, 2);
            // return stat
            return userBettingObject;
        })
    }

    public async find(): Promise<{ [key: string]: UserBettingStatistics }> {
        const query = QueryBuilder(BetSlip.tableName)
            .join(BetSlipDetail.tableName, function () {
                this.on(BetSlip.tableName + ".id", "=", BetSlipDetail.tableName + ".betslip_id")
            })
            .whereBetween(BetSlip.tableName + ".place_date", [this.date_from, this.date_to])
            .select(BetSlip.tableName + ".won_amount as won_amount")
            .select(BetSlip.tableName + ".place_date as place_date")
            .select(BetSlip.tableName + ".possible_won_amount as possible_won_amount")
            .select(BetSlip.tableName + ".money_type as money_type")
            .select(BetSlip.tableName + ".amount as amount")
            .select(BetSlip.tableName + ".type_id as type_id")
            .select(BetSlip.tableName + ".status_id as status_id")
            .select(BetSlip.tableName + ".id as id")
            .select(BetSlipDetail.tableName + ".sport_id")
            .select(BetSlipDetail.tableName + ".country_id")
            .select(BetSlipDetail.tableName + ".league_id")
            .select(BetSlipDetail.tableName + ".provider_id")
            .select(BetSlipDetail.tableName + ".market_id")
        if (this.sport_id) query.andWhere(BetSlipDetail.tableName + ".sport_id", "=", this.sport_id);
        if (this.country_id) query.andWhere(BetSlipDetail.tableName + ".country_id", "=", this.country_id);
        if (this.league_id) query.andWhere(BetSlipDetail.tableName + ".league_id", "=", this.league_id);
        if (this.event_id) query.andWhere(BetSlipDetail.tableName + ".event_id", "=", this.event_id);
        if (this.market_id) query.andWhere(BetSlipDetail.tableName + ".market_id", "=", this.market_id);
        if (this.selection_id) query.andWhere(BetSlipDetail.tableName + ".selection_id", "=", this.selection_id);
        if (this.user_id) query.andWhere(BetSlip.tableName + ".user_id", "=", this.user_id);
        if (this.money_type) query.andWhere(BetSlip.tableName + ".money_type", "=", this.money_type);
        if (this.type_id) query.andWhere(BetSlip.tableName + ".type_id", "=", this.type_id);

        const queryString = query.toString();
        const result = await BetSlip.db.manyOrNone(queryString);

        const stats: { [key: string]: UserBettingStatistics } = {};
        // if results empty return stats
        if (result.length == 0) return stats;
        // if group_by does not provided
        if (this.group_by === undefined) {
            stats[StatisticGroup.ALL] = await this.getStatistics(result);
        } else if ([
            StatisticGroup.SPORT, StatisticGroup.COUNTRY, StatisticGroup.LEAGUE,
            StatisticGroup.MARKET, StatisticGroup.PROVIDER].includes(this.group_by)) {
            const groupped = groupBy(result, this.group_by + '_id');
            await map(Object.keys(groupped), async key => {
                stats[key] = await this.getStatistics(groupped[key].map((b: IBetSlip) => new BetSlip(b)));
            })
            // get names depending on stats id
            let names = await this.getStatNames(Object.keys(stats), this.group_by);
            if (names !== undefined) {
                // replace ids with names
                await map(Object.keys(stats), async id => {
                    const category = <any>(<any[]>names).find(cat => cat.id === Number(id))
                    stats[category.name] = stats[id];
                    delete stats[id];
                })
            }
        } else if (this.group_by === StatisticGroup.MONTH) {
            // group by month
            const groupped = groupBy(result, function (bet: IBetSlip) {
                bet.place_date = new Date(<any>bet.place_date);
                return bet.place_date.toISOString().slice(0, 7).replace(/-/g, "-");
            });
            await map(Object.keys(groupped), async key => {
                stats[key] = await this.getStatistics(groupped[key].map((b: IBetSlip) => new BetSlip(b)));
            })
        } else if (this.group_by === StatisticGroup.DAY) {
            // group by month
            const groupped = groupBy(result, function (bet: IBetSlip) {
                bet.place_date = new Date(<any>bet.place_date);
                return bet.place_date.toISOString().slice(0, 10).replace(/-/g, "-");
            });
            await map(Object.keys(groupped), async key => {
                stats[key] = await this.getStatistics(groupped[key].map((b: IBetSlip) => new BetSlip(b)));
            })
        }
        return stats;
    }

    private async getStatistics(bets: IBetSlip[]): Promise<UserBettingStatistics> {
        const statistics = new UserBettingStatistics({ user_id: bets[0].user_id });
        await each(bets, bet => {
            bet.amount = toNumber(bet.amount);
            if (bet.status_id != BetSlipStatus.ACTIVE) {
                statistics.roi = statistics.won_amount - statistics.placed_total;
            }
        })

        // total amount
        statistics.placed_total = sumBy(bets, "amount");

        const betsDetails = bets.reduce((result: IBetSlipDetail[], b) => result.concat(b.details), []).filter(d => d !== undefined && d.odd !== undefined);
        statistics.max_odd = max(betsDetails.map(d => d.odd)) || 0;
        statistics.min_odd = min(betsDetails.map(d => d.odd)) || 0;
        statistics.avg_odd = sumBy(betsDetails, "odd") / betsDetails.length;

        // won stats
        const activeBets = bets.filter(b => b.status_id == BetSlipStatus.ACTIVE);
        const activeBetsDetails = activeBets.reduce((result: IBetSlipDetail[], b) => result.concat(b.details), []).filter(d => d !== undefined && d.odd !== undefined);
        statistics.active_amount = sumBy(activeBets, "amount");
        statistics.active_avg_odd = sumBy(activeBetsDetails, "odd") / activeBetsDetails.length;
        statistics.active_count = activeBets.length;
        statistics.active_max_odd = max(activeBetsDetails.map(d => d.odd)) || 0;
        statistics.active_min_odd = min(activeBetsDetails.map(d => d.odd)) || 0;

        // won stats
        const wonBets = bets.filter(b => b.status_id == BetSlipStatus.WIN || b.status_id == BetSlipStatus.HALF_WIN);
        const wonBetsDetails = wonBets.reduce((result: IBetSlipDetail[], b) => result.concat(b.details), []).filter(d => d !== undefined && d.odd !== undefined);
        statistics.won_amount = sumBy(wonBets, "won_amount");
        statistics.won_avg_odd = sumBy(wonBetsDetails, "odd") / wonBetsDetails.length;
        statistics.won_count = wonBets.length;
        statistics.won_max = max(wonBets.map(b => b.won_amount)) || 0;
        statistics.won_max_odd = max(wonBetsDetails.map(d => d.odd)) || 0;
        statistics.won_min = min(wonBets.map(b => b.won_amount)) || 0;
        statistics.won_min_odd = min(wonBetsDetails.map(d => d.odd)) || 0;

        // lost stats
        const lostBets = bets.filter(b => b.status_id == BetSlipStatus.LOST);
        const lostBetsDetails = lostBets.reduce((result: IBetSlipDetail[], b) => result.concat(b.details), []).filter(d => d !== undefined && d.odd !== undefined);
        statistics.lost_amount = sumBy(lostBets, "amount");
        statistics.lost_avg_odd = sumBy(lostBetsDetails, "odd") / lostBetsDetails.length;
        statistics.lost_count = lostBets.length;
        statistics.lost_max = max(lostBets.map(b => b.amount)) || 0;
        statistics.lost_max_odd = max(lostBetsDetails.map(d => d.odd)) || 0;
        statistics.lost_min = min(lostBets.map(b => b.amount)) || 0;
        statistics.lost_min_odd = min(lostBetsDetails.map(d => d.odd)) || 0;

        statistics.user_id = bets[0].user_id;
        statistics.total_count = bets.length;
        statistics.roi = 100 * statistics.roi / statistics.placed_total;
        statistics.yield = round(((statistics.won_amount / (statistics.won_amount + statistics.lost_amount)) - 1) * 100 || 0, 2);

        return statistics;
    }

    private async getStatNames(stat_ids: string[], group_by: string): Promise<any[] | undefined> {
        // if groupped by category get category name
        if (["sport", "country", "league"].includes(group_by)) {
            return broker.sendRequest(CommunicationCodes.GET_CATEGORIES, {
                ids: stat_ids,
                lang_id: this.lang_id
            }, QueueType.CATEGORY_SERVICE);

        } else if (group_by == "market") {
            // if groupped by market get market name
            return broker.sendRequest(CommunicationCodes.GET_MARKETS, {
                ids: stat_ids,
                lang_id: this.lang_id
            }, QueueType.MARKET_SERVICE);

        } else if (group_by == "provider") {
            // if groupped by provider get provider name
            return broker.sendRequest(CommunicationCodes.GET_ALL_PROVIDERS, {
                ids: stat_ids,
                lang_id: this.lang_id
            }, QueueType.COMMON_SERVICE);
        }
        return undefined;
    }
}