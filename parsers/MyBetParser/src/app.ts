/**
 * Created by   on 3/5/2017.
 */

import { v4 } from "uuid";
import * as promise from 'bluebird';
import { QueueType } from "../../../CommonJS/src/messaging/QueueType";
import { ExchangeType } from "../../../CommonJS/src/messaging/ExchangeType";
import { ProviderID } from "../../BaseParser/src/ProviderID";
import { MainBookParser } from "./parsers/mainbook/MainBookParser";
import { HTTPUtil } from "./utils/httpUtil";
import { VolatileParser } from "./parsers/volatile/VolatileParser";
import { scheduleJob } from "node-schedule";
import { ServiceBase, broker } from "../../../CommonJS/src/bll/services/ServiceBase";
import { MessageHandler } from "./messaging/MessageHandler";
import { ParserBase } from "../../BaseParser/src/ParserBase";
import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { ProviderStatus } from "../../BaseParser/src/ProviderStatus";
const pgp = require('pg-promise')({
    promiseLib: promise
});

class Server {
    private mainBookParser: ParserBase;
    private volatileParser: ParserBase;

    constructor() {
        HTTPUtil.init();
        this.initDB();
        this.initBroker();
        this.scheduleDataParse();
    }

    private initDB() {
        const CONF = require('../../../config/configuration.json');
        const db = CONF.Databases.FeedMyBet.postgres;
        const user: string = db.user;
        const password: string = db.password;
        const port: string = db.port;
        const host: string = db.host;
        const database: string = db.database;
        ServiceBase.db = pgp('postgres://' + user + ':' + password + '@' + host + ':' + port + '/' + database);
        ServiceBase.providerId = ProviderID.MY_BET;
    }

    private async initBroker() {
        await broker.init();
        const exchange = broker.declareExchange(ExchangeType.PROVIDER_EXCHANGE);
        //setup queue for being able to reply to exactly this service requests
        const callbackQueue = QueueType.MY_BET_PARSER_SERVICE + "-" + v4();
        broker.declareQueue(callbackQueue, { autoDelete: true });
        broker.callbackQueue = callbackQueue;

        //get messages from message broker
        const handler = new MessageHandler();
        const parsers: ParserBase[] = [];
        parsers.push(this.mainBookParser, this.volatileParser);
        broker.subscribe(callbackQueue, (message) => {
            handler.handleMessage(message, parsers);
        }, exchange, false);

    }

    private scheduleDataParse() {
        this.mainBookParser = new MainBookParser();
        this.volatileParser = new VolatileParser();
        scheduleJob('*/30 * * * *', () => {
            this.volatileParser.processRequest();
        });

        //ping job
        scheduleJob('*/5 * * * * *', () => {
            broker.publishMessageWithCode(CommunicationCodes.PARSER_PING, {
                id: ServiceBase.providerId,
                ping_date: new Date(),
                status_id: this.volatileParser.status == ProviderStatus.PARSING ? this.volatileParser.status : this.mainBookParser.status
            }, QueueType.COMMON_SERVICE);
        });
        this.mainBookParser.start();
    }
}

new Server();
