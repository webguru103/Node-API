/**
 * Created by   on 3/5/2017.
 */

import * as uuid from "uuid";
import { ProviderID } from "../../BaseParser/src/ProviderID";
import { QueueType } from "../../../CommonJS/src/messaging/QueueType";
import { ExchangeType } from "../../../CommonJS/src/messaging/ExchangeType";
import { ParserBase } from "../../BaseParser/src/ParserBase";
import { HTTPUtil } from "./utils/httpUtil";
import { broker, ServiceBase } from "../../../CommonJS/src/bll/services/ServiceBase";
let schedule = require("node-schedule");
import promise = require('bluebird');
import { Parser } from "./parsers/Parser";
import { MessageHandler } from "./messaging/MessageHandler";
import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
const pgp = require('pg-promise')({
    promiseLib: promise
});

class Server {
    parser: ParserBase;
    constructor() {
        HTTPUtil.init();
        this.initDB();
        this.initBroker();
        this.scheduleDataParse();
    }

    private scheduleDataParse() {
        this.parser = new Parser();
        // schedule.scheduleJob('0 */3 * * *', () => {
        //     console.log("job started at:" + new Date().toUTCString());
        //     this.parser.processRequest();
        // });
        //ping job
        schedule.scheduleJob('*/5 * * * * *', () => {
            broker.publishMessageWithCode(CommunicationCodes.PARSER_PING, {
                id: ServiceBase.providerId,
                ping_date: new Date(),
                status_id: this.parser.status
            }, QueueType.COMMON_SERVICE);
        });
        this.parser.start();
    }

    private initDB() {
        const CONF = require('../../../config/configuration.json');
        const db = CONF.Databases.FeedBet365.postgres;
        const user: string = db.user;
        const password: string = db.password;
        const port: string = db.port;
        const host: string = db.host;
        const database: string = db.database;
        ServiceBase.db = pgp('postgres://' + user + ':' + password + '@' + host + ':' + port + '/' + database);
        ServiceBase.providerId = ProviderID.BET365;
    }

    private async initBroker() {
        await broker.init();
        let exchange = broker.declareExchange(ExchangeType.PROVIDER_EXCHANGE);
        //setup queue for being able to reply to exactly this service requests
        let callbackQueue = QueueType.BET_365_PARSER_SERVICE + "-" + uuid.v4();
        broker.declareQueue(callbackQueue, { autoDelete: true });
        broker.callbackQueue = callbackQueue;

        //get messages from message broker
        let handler = new MessageHandler();
        broker.subscribe(callbackQueue, (message) => {
            handler.handleMessage(message, this.parser)
        }, exchange, false);
    }
}

new Server();