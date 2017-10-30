import { UserBettingStatisticFilter } from "../filters/user.betting.statistic.filter";
import { UserBettingStatistics } from "../models/user.betting.statistic.model";
import { UserLeaderboard } from "../models/user.leaderboard.model";
import { UserLeaderboardFilter } from "../filters/user.leaderboard.filter";

export class StatisticService {
    async getсUserBettingStatistic(data: UserBettingStatisticFilter): Promise<{ [key: string]: UserBettingStatistics }> {
        return await new UserBettingStatisticFilter(data).find();
    }

    async getLeaderboard(data: UserLeaderboardFilter): Promise<UserLeaderboard[] | undefined> {
        return await new UserLeaderboardFilter(data).find();
    }

    async getUserTipsterObjects(data: UserBettingStatisticFilter): Promise<any[] | undefined> {
        return await new UserBettingStatisticFilter(data).findSports();
    }
}