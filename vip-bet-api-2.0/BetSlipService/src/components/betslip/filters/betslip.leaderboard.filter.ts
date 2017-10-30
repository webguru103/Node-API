import { NormalizePage, NormalizeLimit } from "../../../../../CommonJS/src/utils/utils";
import { BetSlip } from "../models/betslip.model";
import { QueryBuilder } from "../../../../../CommonJS/src/base/base.model";
import { BetSlipDetail } from "../../betslipdetail/models/betslipdetail.model";
import { each, map } from "bluebird";
import { IBetSlip } from "../interfaces/betslip.interface";
import { groupBy } from "lodash";
import { MAX_DATE, MIN_DATE } from "../../../../../CommonJS/src/domain/constant";
import { UserBettingStatistics } from "../../statistics/models/user.betting.statistic.model";
import { BetSlipStatus } from "../enums/betslip_status.enum";

export class BetSlipLeaderboardFilter {
    public date_from: Date;
    public date_to: Date;
    public sport_id?: number;
    public page: number;
    public limit: number;

    constructor(filter: Partial<BetSlipLeaderboardFilter>) {
        this.date_from = filter.date_from || MIN_DATE;
        this.date_to = filter.date_to || MAX_DATE;
        this.sport_id = filter.sport_id;
        this.page = NormalizePage((filter.page || 1) - 1);
        this.limit = NormalizeLimit(filter.limit || 20);
    }

    public async find(): Promise<UserBettingStatistics[]> {
        const query = QueryBuilder(BetSlip.tableName)
            .join(BetSlipDetail.tableName, function () {
                this.on(BetSlip.tableName + ".id", "=", BetSlipDetail.tableName + ".betslip_id")
            })
            .whereBetween(BetSlip.tableName + ".place_date", [this.date_from, this.date_to])
            .select(BetSlip.tableName + ".won_amount as won_amount")
            .select(BetSlip.tableName + ".possible_won_amount as possible_won_amount")
            .select(BetSlip.tableName + ".money_type as money_type")
            .select(BetSlip.tableName + ".amount as amount")
            .select(BetSlip.tableName + ".type_id as type_id")
            .select(BetSlip.tableName + ".status as status")
            .select(BetSlip.tableName + ".id as id")
            .select(BetSlipDetail.tableName + ".sport_id")
            .select(BetSlipDetail.tableName + ".country_id")
            .select(BetSlipDetail.tableName + ".league_id")
            .select(BetSlipDetail.tableName + ".provider_id")
        if (this.sport_id) query.andWhere(BetSlipDetail.tableName + ".sport_id", "=", this.sport_id);

        const queryString = query.toString();
        const result = await BetSlip.db.manyOrNone(queryString);
        const bets: IBetSlip[] = result.reduce((result, r) => {
            const exist = result.find(b => { return b.id == r.id })
            if (!exist) {
                result.push(new BetSlip(r));
            }
            return result;
        }, []);

        const groupped = groupBy(bets, 'user_id');
        return map(Object.keys(groupped), async key => {
            return this.getStatistics(groupped[key]);
        })
    }

    private async getStatistics(bets: IBetSlip[]): Promise<UserBettingStatistics> {
        const statistics = new UserBettingStatistics({ user_id: bets[0].user_id });
        await each(bets, bet => {
            statistics.placed_total += bet.amount;

            if (bet.status_id == BetSlipStatus.ACTIVE) {
                statistics.active_count += 1;
            }
            if (bet.status_id == BetSlipStatus.WIN) {
                statistics.won_count += 1;
                statistics.won_amount += bet.won_amount;
            }
            if (bet.status_id != BetSlipStatus.ACTIVE) {
                statistics.roi = statistics.won_amount - statistics.placed_total;
            }
        })

        statistics.user_id = bets[0].user_id;
        statistics.total_count = bets.length;
        statistics.roi = 100 * statistics.roi / statistics.placed_total;
        return statistics;
    }
}