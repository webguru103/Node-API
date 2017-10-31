import { QueueType } from "../messaging/QueueType";
import { BrokerUtil } from "../messaging/BrokerUtil";

const broker = BrokerUtil .getBroker();

export function LogError(from: string, error: any) {
    this.log({ from: from, message: { type: 1, message: error } });
}

export function LogWarning(from: string, warning: any) {
    this.log({ from: from, message: { type: 2, message: warning } });
}

export function LogInfo(from: string, info: any) {
    this.log({ from: from, message: { type: 3, message: info } });
}

function log(message: any) {
    broker.publishMessage(message, QueueType.LOG_SERVICE);
}