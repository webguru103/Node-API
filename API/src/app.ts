/**
 * Created by   on 3/10/2017.
 */

import * as bodyParser from "body-parser";
import * as express from "express";
import * as uuid from "uuid";
import { QueueType } from "../../CommonJS/src/messaging/QueueType";
import { broker, BaseModel } from "../../CommonJS/src/base/base.model";

const commonRoute = require("./routes/common.route");
const categoryRoute = require("./routes/category.route");
const marketRoute = require("./routes/market.route");
const participantsRoute = require("./routes/participants.route");
const eventsRoute = require("./routes/events.route");
const eventMarketRoute = require("./routes/eventmarket.route");
const warningRoute = require("./routes/warning.route");
const authRoute = require("./routes/auth.route");
const betlslipRoute = require("./routes/betslip.route");
const betlslipDetailRoute = require("./routes/betslipdetails.route");
const usersRoute = require("./routes/users.route");
const mappingRoute = require("./routes/mapping.route");
const scopesRoute = require("./routes/scopes.route");
const statisticTypesRoute = require("./routes/statistic_types.route");
const rulesRoute = require("./routes/rules.route");
const resultsRoute = require("./routes/results.route");
require("./components/passport/strategies/local.strategy");
import { User } from "./components/users/models/user.model";
import { UserRoles } from "./components/user_roles/models/user_roles.model";
const pgp = require('pg-promise')({
    promiseLib: require('bluebird')
});

class Server {
    public app: express.Express;

    public static server(): Server {
        return new Server();
    }

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.initDB();
        this.initBroker();
        this.createSuperAdmin();
        // this.registerOldUsers();
    }

    private config() {
        //mount json form parser
        this.app.use(bodyParser.json());
        //mount query string parser
        this.app.use(bodyParser.urlencoded({ extended: true }));
        // catch 404 and forward to error handler
        this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            err.status = 404;
            next(err);
        });
        this.app.use(function (req, res, next) {
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', '*');
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            // Pass to next layer of middleware
            next();
        });
    }

    private routes() {
        this.app.use("/", commonRoute);
        this.app.use("/", categoryRoute);
        this.app.use("/", participantsRoute);
        this.app.use("/", eventsRoute);
        this.app.use("/", eventMarketRoute);
        this.app.use("/", warningRoute);
        this.app.use("/", marketRoute);
        this.app.use("/", authRoute);
        this.app.use("/", betlslipRoute);
        this.app.use("/", betlslipDetailRoute);
        this.app.use("/", usersRoute);
        this.app.use("/", mappingRoute);
        this.app.use("/", scopesRoute);
        this.app.use("/", statisticTypesRoute);
        this.app.use("/", rulesRoute);
        this.app.use("/", resultsRoute);
    }

    private initDB() {
        const CONF = require('../../config/configuration.json');
        const db = CONF.Databases.Api.postgres;
        const user: string = db.user;
        const password: string = db.password;
        const port: string = db.port;
        const host: string = db.host;
        const database: string = db.database;
        BaseModel.db = pgp('postgres://' + user + ':' + password + '@' + host + ':' + port + '/' + database);
    }

    private async initBroker() {
        await broker.init();
        const queueName = QueueType.API_SERVICE;
        //setup queue for being able to reply to exactly this service requests
        const callbackQueue = queueName + "-" + uuid.v4();
        broker.declareQueue(callbackQueue, { autoDelete: true });
        broker.callbackQueue = callbackQueue;
        broker.subscribe(callbackQueue, undefined, undefined, false);
    }

    private async createSuperAdmin() {
        let user = await User.findOne(<any>User, { email: "sadmin@vip-bet.com" });
        if (user) {
            user = new User(user);
            user.user_roles = UserRoles.GetSuperAdminPermissions;
            await user.generateSaltAndHash("123");
            await user.update();
        }
        else {
            const sadmin = new User(<any>{
                email: "sadmin@vip-bet.com",
                user_roles: UserRoles.GetSuperAdminPermissions,
            })
            await sadmin.generateSaltAndHash("123");
            await sadmin.saveWithID();
        }
    }
    // private async registerOldUsers() {
    //     const users = oldUsers;
    //     await map(users, async userMigration => {
    //         let user = await User.findOne(<any>User, { username: userMigration[1] });
    //         // if user already exists return
    //         if (user) return;
    //         // try to find user
    //         user = await User.findOne(<any>User, { email: userMigration[4] });
    //         // if user already exists return
    //         if (user) return;
    //         // try to find user
    //         user = await User.findOne(<any>User, { wordpress_id: String(userMigration[0]) });
    //         // create new user
    //         user = new UserSanitized(<any>{
    //             email: userMigration[4],
    //             username: userMigration[1],
    //             wordpress_id: userMigration[0],
    //             wordpress_token: userMigration[10],
    //             wordpress_username: userMigration[1]
    //         });
    //         // generate password hash
    //         await user.generateSaltAndHash();
    //         // save user
    //         return user.saveWithID();
    //     })
    // }
}

let server = Server.server();
module.exports = server.app;