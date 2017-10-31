/**
 * Created by   on 3/2/2017.
 */

import * as uuid from "uuid";
import { ServiceBase, broker } from "../../CommonJS/src/bll/services/ServiceBase";
import { QueueType } from "../../CommonJS/src/messaging/QueueType";
import { MessageHandler } from "./messaging/MessageHandler";
import promise = require('bluebird');
const pgp = require('pg-promise')({
    promiseLib: promise
});

class Server {
    constructor() {
        this.initDB();
        this.initBroker();
    }
    
    private initDB() {
        const CONF = require('../../config/configuration.json');
        const db = CONF.Databases.Warnings.postgres;
        const user: string = db.user;
        const password: string = db.password;
        const port: string = db.port;
        const host: string = db.host;
        const database: string = db.database;
        ServiceBase.db = pgp('postgres://' + user + ':' + password + '@' + host + ':' + port + '/' + database);
    }

    private async initBroker() {
        await broker.init();
        let queueName = QueueType.WARNINGS;

        //setup queue for being able to reply to exactly this service requests
        let callbackQueue = queueName + "-" + uuid.v4();
        broker.declareQueue(callbackQueue, { autoDelete: true });
        broker.callbackQueue = callbackQueue;
        new MessageHandler(broker, callbackQueue, false);

        //get messages from message broker
        new MessageHandler(broker, queueName);
    }
}

new Server();
