import { IUserLeaderboard } from "../interfaces/user.leaderboard.interface";
import { IPublicUser } from "../../../../../API/src/components/users/interfaces/user.interface";
import { Get, Post } from "../../../utils/http.utils";
export class UserLeaderboard implements IUserLeaderboard {
    user?: UserMiniModel;
    tips?: number;
    profit?: number;
    yield?: number;
    prize?: number;

    constructor(data: IUserLeaderboard) {
        this.user = data.user;
        this.tips = data.tips;
        this.profit = data.profit;
        this.yield = data.yield;
        this.prize = data.prize;
    }

    public async getUserData(user_id: number): Promise<IPublicUser | undefined> {
        const loginData = await Post("https://localhost:5000/login", { email: "sadmin@vip-bet.com", password: "123" });
        const accessToken = loginData.data.access_token;
        if (!accessToken) return;
        const userData = await Get(`https://localhost:5000/users/${user_id}`, undefined, { Authorization: accessToken });
        this.user = new UserMiniModel(<any>userData.data);
    }

}
export class UserMiniModel {
    username?: string
    first_name?: string
    last_name?: string
    avatar?: string
    id?: number
    wordpress_id?: string
    constructor(user: IPublicUser) {
        this.username = user.username;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.avatar = user.avatar;
        this.id = user.id;
        this.wordpress_id = user.wordpress_id;
    }
}