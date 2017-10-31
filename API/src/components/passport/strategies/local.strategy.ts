import { use } from "passport";
import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { User } from "../../users/models/user.model";
import { ResolveFile } from "../../../utils/fs.utils";
import { Inflate } from "../../../utils/crypto.utils";

const PRIVATE_KEY = ResolveFile('keys', 'ca.key');

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: PRIVATE_KEY,
    audience: "private:*"
}

use(new Strategy(opts, async (jwt_payload, done) => {
    const json = await Inflate(jwt_payload.data);
    const data = JSON.parse(json);
    const user = <User>await User.findOne(<any>User, { id: data.user_id });
    if (!user) return done(null, false);
    done(null, user);
}))