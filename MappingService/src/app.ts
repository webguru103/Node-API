/**
 * Created by   on 3/4/2017.
 */

import { v4 } from "uuid";
import { QueueType } from "../../CommonJS/src/messaging/QueueType";
import { MessageHandler } from "./messaging/MessageHandler";
import { broker, BaseModel } from "../../CommonJS/src/base/base.model";

const pgp = require('pg-promise')({
    promiseLib: require('bluebird')
});

export const defaultProvider = { value: 2 };

class Server {
    constructor() {
        this.initBroker();
        this.initDB();
    }

    private async initBroker() {
        await broker.init();
        const queueName = QueueType.MAPPING_SERVICE;
        //setup queue for being able to reply to exactly this service requests
        const callbackQueue = queueName + "-" + v4();
        broker.declareQueue(callbackQueue, { autoDelete: true });
        broker.callbackQueue = callbackQueue;
        new MessageHandler(broker, callbackQueue, false);
        //get messages from message broker
        new MessageHandler(broker, queueName);
    }

    private initDB() {
        const CONF = require('../../config/configuration.json');
        const db = CONF.Databases.Mapping.postgres;
        const user: string = db.user;
        const password: string = db.password;
        const port: string = db.port;
        const host: string = db.host;
        const database: string = db.database;
        BaseModel.db = pgp('postgres://' + user + ':' + password + '@' + host + ':' + port + '/' + database);
    }
}

new Server();