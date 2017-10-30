import { IMessageBroker } from "./IMessageBroker";
/**
 * Created by   on 3/1/2017.
 */

export abstract class MessageHandlerBase {
    private broker: IMessageBroker;

    constructor(broker?: IMessageBroker, queueName?: string, ack: boolean = true) {
        if (broker) {
            this.broker = broker;
        }
        if (queueName) {
            this.broker.subscribe(queueName, this.handleMessage, undefined, ack);
        }
    }

    protected abstract handleMessage(message: any): Promise<any>;
}