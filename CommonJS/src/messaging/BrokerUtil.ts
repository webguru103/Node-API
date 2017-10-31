import {IMessageBroker} from "./IMessageBroker";
import {RMQBroker} from "./RMQBroker";
/**
 * Created by   on 3/1/2017.
 */
export class BrokerUtil {
    private static broker: IMessageBroker;

    public static getBroker(): IMessageBroker {
        if (this.broker == null) {
            this.broker = new RMQBroker();
        }
        return this.broker;
    }
}