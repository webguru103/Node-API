/**
 * Created by   on 3/1/2017.
 */
import * as Amqp from "amqp-ts-async";
import { v4 } from "uuid";
import { IMessageBroker } from "./IMessageBroker";
import { CommunicationCodes } from "./CommunicationCodes";
import { Message, Queue, Exchange } from "amqp-ts-async";

const CONF = require('../../../config/configuration.json');
const username: string = CONF.RabbitMQ.username;
const password: string = CONF.RabbitMQ.password;
const vhost: string = CONF.RabbitMQ.vhost;
const host: string = CONF.RabbitMQ.host;
const port: string = CONF.RabbitMQ.port;
const connectionString = "amqp://" + username + ":" + password + "@" + host + ":" + port + vhost;

const connection = new Amqp.Connection(connectionString);

export class RMQBroker implements IMessageBroker {
    private requestPromise: any = {};

    async subscribe(queueName: string, callback: Function, exchange?: Exchange, ack: boolean = true) {
        let queue = connection.declareQueue(queueName, { prefetch: 1000 });
        if (exchange) {
            await queue.bind(exchange);
        }
        queue.activateConsumer(async message => {
            const body = message.getContent();
            // if this is reply to early made request
            const correlationId = message.properties.correlationId;
            const def = this.requestPromise[correlationId];

            if (correlationId && def) {
                if (body.errorCode == 0) {
                    def.resolve(body.response);
                } else {
                    def.reject(body.response);
                }
                delete this.requestPromise[correlationId];
            } else {
                //if this is not reply
                if (callback == null) {
                    return new Message();
                } else {
                    const response = await this.sendResponse(callback, body, message, queueName);
                    if (ack) message.ack();
                    return response;
                }
            }
        }, { noAck: !ack });
    }

    public callbackQueue: string;

    init() {
        return connection.completeConfiguration();
    }

    sendToExchange(code: CommunicationCodes, body: any, exchangeName: string): void {
        const message = new Message({ code: code, body: body });
        const exchange = connection.declareExchange(exchangeName, undefined, { noCreate: true });
        exchange.send(message);
    }

    sendRequest(code: CommunicationCodes, body: any, queueName: string): Promise<any> {
        return new Promise((res, rej) => {
            const reqId = v4();
            this.requestPromise[reqId] = { resolve: res, reject: rej };

            const message = new Message({ code: code, body: body });
            message.properties.replyTo = this.callbackQueue;
            message.properties.correlationId = reqId;

            connection.declareQueue(queueName, { noCreate: true }).send(message);
        })
    }

    publishMessage(msg: string, queueName: string): void {
        const message = new Message(msg);
        const queue = connection.declareQueue(queueName);
        queue.send(message);
    }

    publishMessageWithCode(code: CommunicationCodes, body: any, queueName: string): void {
        const message = new Message({ code: code, body: body });
        const queue = connection.declareQueue(queueName);
        queue.send(message);
    }

    declareQueue(name: string, options?: Queue.DeclarationOptions): Queue {
        return connection.declareQueue(name, options);
    }

    declareExchange(name: string, type: string, options?: Exchange.DeclarationOptions): Exchange {
        return connection.declareExchange(name, type, options);
    }

    async sendResponse(action: Function, body: any, message: Message, queueName: string): Promise<any> {
        const reply = await action(body).then(result => {
            const reply = {
                errorCode: 0,
                response: result
            };
            return reply;
        }, error => {
            const reply = {
                errorCode: -1,
                response: error.message
            };
            this.sendError(error, message.getContent(), queueName + "_exception");
            return reply;
        });
        const replyMessage = new Message(reply);
        replyMessage.properties.correlationId = message.properties.correlationId;
        return replyMessage;
    }

    public sendError(error: any, body: string, queueName: string): void {
        const errorMessage = new Message({
            exception: error.message,
            onMessage: body,
            to: queueName,
            date: new Date().toUTCString()
        });

        const queue = connection.declareQueue(queueName);
        queue.send(errorMessage);
    }
}