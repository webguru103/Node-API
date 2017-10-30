/**
 * Created by   on 3/1/2017.
 */
import { MessageHandlerBase } from "../../../CommonJS/src/messaging/MessageHandlerBase";
import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { CategoryService } from "../components/category/services/category.service";

const service = new CategoryService();
export class MessageHandler extends MessageHandlerBase {

    protected async handleMessage(message: any): Promise<any> {
        const body = message.body;
        switch (message.code) {
            case CommunicationCodes.ADD_CATEGORY:
                return service.add(body);
            case CommunicationCodes.GET_CATEGORY:
                return service.get(body);
            case CommunicationCodes.GET_CATEGORIES:
                return service.list(body);
            case CommunicationCodes.UPDATE_CATEGORY:
                return service.update(body);
            case CommunicationCodes.DELETE_CATEGORY:
                return service.delete(body.id, body.move_to_league);
            case CommunicationCodes.UPDATE_CATEGORY_ORDER:
                return service.updateOrder(body.id, body.type_id, body.parent_category_id, body.step, body.direction);
            case CommunicationCodes.GET_CATEGORIES_BY_TIME:
                return service.getByTimeRange(body);
        }
    }
}