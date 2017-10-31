import { CommunicationCodes } from "../../../../CommonJS/src/messaging/CommunicationCodes";
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ServiceBase } from "../../../../CommonJS/src/bll/services/ServiceBase";

export class MessageHandler {
    async handleMessage(message: any, parser: ParserBase): Promise<any> {
        if (message.body.id != ServiceBase.providerId) return;
        switch (message.code) {
            case CommunicationCodes.STOP_PROVIDER:
                return parser.stop();
            case CommunicationCodes.RESTART_PROVIDER:
                return parser.restart();
        }
    }
}