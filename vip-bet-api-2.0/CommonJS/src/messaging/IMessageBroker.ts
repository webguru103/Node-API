import { Queue, Message, Exchange } from "amqp-ts-async";
import { CommunicationCodes } from "./CommunicationCodes";
import { Thenable } from "bluebird";
/**
 * Created by   on 3/1/2017.
 */
export interface IMessageBroker {
    sendRequest(code: CommunicationCodes, body: any, queueName: string): Thenable<any>;
    sendToExchange(code: CommunicationCodes, body: any, exchangeName: string): void;
    sendResponse(action: any, body: any, message: any, queueName: string): Thenable<Message>;
    sendError(error: any, body: string, correlationId: string, queueName: string): void;
    subscribe(queue: string, callback?: Function, exchange?: Exchange, ack?: boolean): void;
    init(): any;
    publishMessage(msg: string, queueName: string): void;
    publishMessageWithCode(ode: CommunicationCodes, body: any, queueName: string): void;
    declareQueue(name: string, options?: Queue.DeclarationOptions): Queue;
    declareExchange(name: string, type?: string, options?: Exchange.DeclarationOptions): Exchange;
    callbackQueue: string;
}