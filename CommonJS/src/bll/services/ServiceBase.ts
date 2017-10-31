/**
 * Created by   on 3/1/2017.
 */
import { IMessageBroker } from "../../messaging/IMessageBroker";
import { BrokerUtil } from "../../messaging/BrokerUtil";

export const broker: IMessageBroker = BrokerUtil.getBroker();
export class ServiceBase {
    public static providerId: number;
    public static db;
}