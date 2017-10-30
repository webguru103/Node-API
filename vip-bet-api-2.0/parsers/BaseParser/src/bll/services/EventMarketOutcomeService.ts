/**
 * Created by   on 3/5/2017.
 */

import { ServiceBase, broker } from "../../../../../CommonJS/src/bll/services/ServiceBase";
import { IEventMarketOutcomeService } from "../abstract/IEventMarketOutcomeService";
import { IEventMarketOutcomeDAL } from "../../dal/abstract/IEventMarketOutcomeDAL";
import { EventMarketOutcomeDAL } from "../../dal/EventMarketOutcomeDAL";
import { CommunicationCodes } from "../../../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../../../CommonJS/src/messaging/QueueType";
import { toNumber } from "lodash";
import { EventStatus } from "../../../../../EventService/src/components/events/enums/event_status.enum";

export class EventMarketOutcomeService extends ServiceBase implements IEventMarketOutcomeService {
    private eventMarketOutcomeDAL: IEventMarketOutcomeDAL = new EventMarketOutcomeDAL();

    async addEventMarketOutcome(id: string, name: string, type: string, marketType: string, eventMarketId: string,
        providerCategoryId: string, odd: number, status: EventStatus, argument: string) {
        id = id.toString();
        type = type.toString();
        marketType = marketType.toString();
        eventMarketId = eventMarketId.toString();
        providerCategoryId = providerCategoryId.toString();
        // add selection template mapping
        await broker.sendRequest(CommunicationCodes.ADD_SELECTION_MAPPING, {
            providerId: ServiceBase.providerId,
            providerSelectionId: type.toString(),
            providerSelectionName: name,
            providerMarketId: marketType.toString(),
            providerCategoryId: providerCategoryId.toString()
        }, QueueType.MAPPING_SERVICE);
        // send request to add mapping for current selection
        let mapId = await broker.sendRequest(CommunicationCodes.MAP_EVENT_SELECTION, {
            providerEventSelectionId: id,
            providerId: ServiceBase.providerId,
            providerEventMarketId: eventMarketId.toString(),
            providerSelectionId: type.toString(),
            providerMarketId: marketType.toString(),
            argument: isNaN(Number(argument)) ? "0.00" : toNumber(argument).toFixed(2),
            providerCategoryId: providerCategoryId.toString()
        }, QueueType.MAPPING_SERVICE);
        //get map id
        mapId = toNumber(mapId);
        //if mapping was not succussfull for some reason dont add selection to db
        if (mapId === 0) return;
        // if event selection exist update
        if (await this.eventMarketOutcomeDAL.getEventMarketOutcome(id)) {
            return this.updateEventMarketOutcome(id, odd, status, mapId);
        } else {
            //if mapping was successfull add event selection with that mapId
            return this.eventMarketOutcomeDAL.addEventMarketOutcome(id, mapId, name, eventMarketId, odd, status, argument);
        }
    }

    updateEventMarketOutcome(id: string, odd: number, status: EventStatus, mapId: number) {
        return this.eventMarketOutcomeDAL.updateEventMarketOutcome(id, odd, status, mapId);
    }

    getEventMarketOutcome(id: string) {
        return this.eventMarketOutcomeDAL.getEventMarketOutcome(id);
    }
}