/**
 * Created by   on 3/10/2017.
 */

import * as uuid from "uuid";
import { QueueType } from "../../CommonJS/src/messaging/QueueType";
import { MessageHandler } from "./messaging/MessageHandler";
import { BaseModel, broker } from "../../CommonJS/src/base/base.model";
import promise = require('bluebird');
const pgp = require('pg-promise')({
    promiseLib: promise
});

class Server {
    constructor() {
        this.initBroker();
        this.initDB();
    }

    private async initBroker() {
        await broker.init();
        let queueName = QueueType.COMMON_SERVICE;

        //setup queue for being able to reply to exactly this service requests
        let callbackQueue = queueName + "-" + uuid.v4();
        broker.declareQueue(callbackQueue, { autoDelete: true });
        broker.callbackQueue = callbackQueue;
        new MessageHandler(broker, callbackQueue, false);

        //get messages from message broker
        new MessageHandler(broker, queueName);
    }

    private initDB() {
        const CONF = require('../../config/configuration.json');
        const db = CONF.Databases.Common.postgres;
        const user: string = db.user;
        const password: string = db.password;
        const port: string = db.port;
        const host: string = db.host;
        const database: string = db.database;
        BaseModel.db = pgp('postgres://' + user + ':' + password + '@' + host + ':' + port + '/' + database);
    }
}

new Server();
