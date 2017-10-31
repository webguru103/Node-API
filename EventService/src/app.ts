/**
 * Created by   on 3/4/2017.
 */

import * as uuid from "uuid";
import { QueueType } from "../../CommonJS/src/messaging/QueueType";
import { MessageHandler } from "./messaging/MessageHandler";
import { broker, BaseModel } from "../../CommonJS/src/base/base.model";
import { scheduleJob } from "node-schedule";
import promise = require('bluebird');
import { EventService } from "./components/events/services/event.service";
const pgp = require('pg-promise')({
    promiseLib: promise
});

class Server {
    constructor() {
        this.initBroker();
        this.initDB();
        this.initJobs();
    }
    private async initBroker() {
        await broker.init();
        let queueName = QueueType.EVENT_SERVICE;

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
        const db = CONF.Databases.Event.postgres;
        const user: string = db.user;
        const password: string = db.password;
        const port: string = db.port;
        const host: string = db.host;
        const database: string = db.database;
        BaseModel.db = pgp('postgres://' + user + ':' + password + '@' + host + ':' + port + '/' + database);
    }

    private initJobs() {
        const eventService = new EventService();
        scheduleJob('*/1 * * * *', () => {
            eventService.closePrematchStartedEvents();
        });
    }
}

new Server();