/**
 * Created by   on 3/1/2017.
 */

import { v4 } from "uuid";
import { QueueType } from "../../CommonJS/src/messaging/QueueType";
import { MessageHandler } from "./messaging/MessageHandler";
import { BaseModel, broker } from "../../CommonJS/src/base/base.model";

import * as promise from 'bluebird';
const pgp = require('pg-promise')({
    promiseLib: promise
});

class Server {
    constructor() {
        this.initDB();
        this.initBroker();
    }

    private async initBroker() {
        await broker.init();
        const queueName = QueueType.PARTICIPANT_SERVICE;
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
        const db = CONF.Databases.Participant.postgres;
        const user: string = db.user;
        const password: string = db.password;
        const port: string = db.port;
        const host: string = db.host;
        const database: string = db.database;
        BaseModel.db = pgp('postgres://' + user + ':' + password + '@' + host + ':' + port + '/' + database);
    }
}

new Server();