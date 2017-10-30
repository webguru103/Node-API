/**
 * Created by   on 3/5/2017.
 */

import { v4 } from "uuid";
import * as promise from 'bluebird';
import { scheduleJob } from "node-schedule";
import { Parser } from "./parsers/Parser";
import { HTTPUtil } from "./utils/httpUtil";
import { QueueType } from "../../../CommonJS/src/messaging/QueueType";
import { ExchangeType } from "../../../CommonJS/src/messaging/ExchangeType";
import { ServiceBase, broker } from "../../../CommonJS/src/bll/services/ServiceBase";
import { ProviderID } from "../../BaseParser/src/ProviderID";
import { MessageHandler } from "./messaging/MessageHandler";
import { ParserBase } from "../../BaseParser/src/ParserBase";
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

    private initDB() {
        const CONF = require('../../../config/configuration.json');
        const db = CONF.Databases.FeedWilliamHills.postgres;
        const user: string = db.user;
        const password: string = db.password;
        const port: string = db.port;
        const host: string = db.host;
        const database: string = db.database;
        ServiceBase.db = pgp('postgres://' + user + ':' + password + '@' + host + ':' + port + '/' + database);
        ServiceBase.providerId = ProviderID.WILLIAM_HILLS;
    }

    private scheduleDataParse() {
        this.parser = new Parser();
        scheduleJob('*/5 * * * * *', () => {
            broker.publishMessageWithCode(CommunicationCodes.PARSER_PING, {
                id: ServiceBase.providerId,
                ping_date: new Date(),
                status_id: this.parser.status
            }, QueueType.COMMON_SERVICE);
        });
        this.parser.start();
    }

    private async initBroker() {
        await broker.init();
        const exchange = broker.declareExchange(ExchangeType.PROVIDER_EXCHANGE);
        //setup queue for being able to reply to exactly this service requests
        const callbackQueue = QueueType.WILLIAM_HILLS_PARSER_SERVICE + "-" + v4();
        broker.declareQueue(callbackQueue, { autoDelete: true });
        broker.callbackQueue = callbackQueue;
        //get messages from message broker
        const handler = new MessageHandler();
        broker.subscribe(callbackQueue, (message) => {
            handler.handleMessage(message, this.parser)
        }, exchange, false);
    }
}

new Server();
