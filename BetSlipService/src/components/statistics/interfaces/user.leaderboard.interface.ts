
import { UserMiniModel } from "../models/user.leaderboard.model";

export interface IUserLeaderboard {
    user?: UserMiniModel,
    tips?: number,
    profit?: number
    yield?: number
    prize?: number
}