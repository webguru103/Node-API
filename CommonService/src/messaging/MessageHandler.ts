/**
 * Created by   on 3/4/2017.
 */
import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { MessageHandlerBase } from "../../../CommonJS/src/messaging/MessageHandlerBase";
import { ProviderService } from "../components/provider/services/provider.service";
import { ConfigService } from "../components/config/services/config.service";
import { ConfigType } from "../components/config/enums/config.type";

let providerService = new ProviderService();
let configService = new ConfigService();

export class MessageHandler extends MessageHandlerBase {

    protected async handleMessage(message: any): Promise<any> {
        const body = message.body;
        switch (message.code) {
            case CommunicationCodes.GET_ALL_PROVIDERS:
                return providerService.getProviders(body);
            case CommunicationCodes.GET_PROVIDER:
                return providerService.getProvider(body);
            case CommunicationCodes.UPDATE_PROVIDER:
                return providerService.updateProvider(body);
            case CommunicationCodes.GET_DEFAULT_PROVIDER:
                return configService.getConfig(ConfigType.DEFAULT_PROVIDER);
            case CommunicationCodes.PARSER_PING:
                return providerService.updateParserPing(body);
            case CommunicationCodes.UPDATE_PROVIDERS_ORDER:
                return providerService.updateOrders(body);
        }
    }
}