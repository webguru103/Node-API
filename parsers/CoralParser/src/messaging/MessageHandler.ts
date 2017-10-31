import { CommunicationCodes } from "../../../../CommonJS/src/messaging/CommunicationCodes";
import { Thenable, resolve } from "bluebird";
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ServiceBase } from "../../../../CommonJS/src/bll/services/ServiceBase";

export class MessageHandler {
    handleMessage(message: any, parser: ParserBase): Thenable<any> {
        if (message.body.id != ServiceBase.providerId) return resolve();
        switch (message.code) {
            case CommunicationCodes.STOP_PROVIDER:
                return parser.stop();
            case CommunicationCodes.RESTART_PROVIDER:
                return parser.restart();
        }
        return resolve();
    }
}