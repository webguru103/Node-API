import { NormalizePage, NormalizeLimit } from "../../../../../CommonJS/src/utils/utils";
import { QueryBuilder, BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { MIN_DATE, MAX_DATE } from "../../../../../CommonJS/src/domain/constant";
import { BetSlipDetail } from "../../betslipdetail/models/betslipdetail.model";
import { groupBy, round, sortBy } from "lodash";
import { BetSlip } from "../../betslip/models/betslip.model";
import { UserLeaderboard } from "../models/user.leaderboard.model";
import { IBetSlip } from "../../betslip/interfaces/betslip.interface";
import { map } from "bluebird";
import { BetSlipStatus } from "../../betslip/enums/betslip_status.enum";
import { BetSlipType } from "../../betslip/enums/betslip_type.enum";

export class UserLeaderboardFilter {
    public date_from: Date;
    public date_to: Date;
    public money_type?: number;
    public type_id?: BetSlipType;
    public sport_id?: number;
    public page: number;
    public limit: number;

    constructor(filter: Partial<UserLeaderboardFilter>) {
        this.date_from = filter.date_from || MIN_DATE;
        this.date_to = filter.date_to || MAX_DATE;
        this.money_type = filter.money_type;
        this.type_id = filter.type_id;
        this.sport_id = filter.sport_id;
        this.page = NormalizePage((filter.page || 1) - 1);
        this.limit = NormalizeLimit(filter.limit || 20);
    }

    public async find(): Promise<UserLeaderboard[] | undefined> {
        const query = QueryBuilder(BetSlip.tableName)
            .join(BetSlipDetail.tableName, function () {
                this.on(BetSlip.tableName + ".id", "=", BetSlipDetail.tableName + ".betslip_id")
            })
            .whereBetween(BetSlip.tableName + ".place_date", [this.date_from, this.date_to])
            .select(BetSlip.tableName + ".won_amount as won_amount")
            .select(BetSlip.tableName + ".amount as amount")
            .select(BetSlip.tableName + ".status_id as status_id")
            .select(BetSlip.tableName + ".user_id")
            .select(BetSlip.tableName + ".id as id")
            .select(BetSlipDetail.tableName + ".id as detail_id")
            .select(BetSlipDetail.tableName + ".sport_id")
        if (this.sport_id) query.andWhere(BetSlipDetail.tableName + ".sport_id", "=", this.sport_id);

        const queryString = query.toString();
        const result = await BaseModel.db.manyOrNone(queryString);
        // group by betslips id
        const grouppedResult = groupBy(result, 'id');
        // betslips
        const betslips: IBetSlip[] = await map(Object.keys(grouppedResult), async betslip_id => {
            const betslip = new BetSlip(<any>grouppedResult[betslip_id][0]);
            // set details
            betslip.details = grouppedResult[betslip_id].map((detail: any) => new BetSlipDetail(<any>{
                id: detail.detail_id,
                betslip_id: betslip.id,
                sport_id: detail.sport_id
            }));
            // return betslip
            return betslip;
        });
        // group betslips by user_id
        const groupped = groupBy(betslips, 'user_id');
        // return statistics
        const stats = await map(Object.keys(groupped), async user_id => this.getStatistics(groupped[user_id]));
        // take users with profit != 0
        let statsWithProfit = stats.filter(stats => <number>stats.profit != 0);
        // take users with 0 profit
        const statsWithoutProfit = stats.filter(stats => <number>stats.profit == 0);
        // sort non 0 profit users
        statsWithProfit = sortBy(statsWithProfit, "profit").reverse();
        // set prizes
        statsWithProfit = statsWithProfit.map((stats, index) => {
            if (stats.profit && stats.profit > 0) stats.prize = prizes[index] || 0;
            return stats;
        });
        // return stats
        return statsWithProfit.concat(statsWithoutProfit);
    }

    private async getStatistics(bets: IBetSlip[]): Promise<UserLeaderboard> {
        // placed amount of money
        // const placed = bets.map(b => b.amount).reduce((prev, next) => prev + next);
        // lost amount
        const lost_amount = bets
            .filter(b => b.status_id === BetSlipStatus.LOST)
            .map(b => b.amount)
            .reduce((prev, next) => prev + next, 0) || 0;
        // won amount of money
        const won_amount = bets
            .filter(b => b.status_id === BetSlipStatus.WIN || b.status_id === BetSlipStatus.HALF_WIN || b.status_id === BetSlipStatus.CANCELLED)
            .map(b => b.amount)
            .reduce((prev, next) => prev + next, 0) || 0;
        // calculate profit percentage
        const statistics = new UserLeaderboard({
            profit: round((won_amount - lost_amount) * 100 / lost_amount, 2) || 0,
            yield: round(((won_amount / (won_amount + lost_amount)) - 1) * 100 || 0, 2),
            tips: bets.map(b => b.details.length).reduce((prev, next) => prev + next) || 0
        });
        // get user data
        await statistics.getUserData(bets[0].user_id);
        // return stats
        return statistics;
    }
}

const prizes = [300,
    200,
    100,
    80,
    70,
    60,
    50,
    40,
    30,
    20,
    15,
    10,
    10,
    10,
    5
]