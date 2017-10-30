/**
 * Created by   on 3/5/2017.
 */

import { v4 } from "uuid";
import * as promise from 'bluebird';
import { QueueType } from "../../../CommonJS/src/messaging/QueueType";
import { ExchangeType } from "../../../CommonJS/src/messaging/ExchangeType";
import { Parser } from "./parsers/Parser";
import { ServiceBase, broker } from "../../../CommonJS/src/bll/services/ServiceBase";
import { ProviderID } from "../../BaseParser/src/ProviderID";
import { MessageHandler } from "./messaging/MessageHandler";
import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { scheduleJob } from "node-schedule";

const pgp = require('pg-promise')({
    promiseLib: promise
});

class Server {
    parser: Parser;
    constructor() {
        this.initDB();
        this.initBroker();
        this.initParsing();
    }

    private initDB() {
        const CONF = require('../../../config/configuration.json');
        const db = CONF.Databases.FeedLadbrokes.postgres;
        const user: string = db.user;
        const password: string = db.password;
        const port: string = db.port;
        const host: string = db.host;
        const database: string = db.database;
        ServiceBase.db = pgp('postgres://' + user + ':' + password + '@' + host + ':' + port + '/' + database);
        ServiceBase.providerId = ProviderID.LAD_BROKES;
    }

    initParsing() {
        this.parser = new Parser();
        //ping job
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
        const callbackQueue = QueueType.LADBROKES_PARSER_SERVICE + "-" + v4();
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
