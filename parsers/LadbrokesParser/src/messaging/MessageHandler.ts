/**
 * Created by   on 3/4/2017.
 */
import { CommunicationCodes } from "../../../../CommonJS/src/messaging/CommunicationCodes";
import { each } from "bluebird";
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { ServiceBase } from "../../../../CommonJS/src/bll/services/ServiceBase";

export class MessageHandler {
    async handleMessage(message: any, ...parsers: ParserBase[]): Promise<any> {
        if (message.body.id != ServiceBase.providerId) return;
        switch (message.code) {
            case CommunicationCodes.STOP_PROVIDER:
                return each(parsers, async parser => parser.stop());
            case CommunicationCodes.RESTART_PROVIDER:
                return each(parsers, async  parser => parser.restart());
        }
    }
}