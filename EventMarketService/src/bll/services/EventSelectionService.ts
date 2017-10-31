/**
 * Created by   on 3/19/2017.
 */
import { EventSelectionDAL } from "../../dal/EventSelectionDAL";
import { CommunicationCodes } from "../../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../../CommonJS/src/messaging/QueueType";
import { reduce } from "bluebird";
import { DEFAULT_LANGUAGE } from "../../../../CommonJS/src/domain/constant";
import { ErrorUtil, ErrorCodes } from "../../../../CommonJS/src/messaging/ErrorCodes";
import { isNummericArray } from "../../../../CommonJS/src/utils/validators";
import { broker } from "../../../../CommonJS/src/base/base.model";
import { ISelectionModel } from "../../../../MarketService/src/components/selections/interfaces/selection.interface";
import { IEventSelectionPublic } from "../../components/event.selection/interfaces/event.selection.interface";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";

export class EventSelectionService {
    private eventSelectionDAL = new EventSelectionDAL();

    async addEventSelection(eventMarketId: number, selectionId: number, argument: number, statusId: EventStatus) {
        return this.eventSelectionDAL.addEventSelection(eventMarketId, selectionId, argument, statusId || EventStatus.ACTIVE);
    }

    async getEventSelection(id: number, langId: number = DEFAULT_LANGUAGE) {
        // get event selection
        const eventSelection: IEventSelectionPublic = await this.eventSelectionDAL.getEventSelection(id);
        // if event selection not found return
        if (!eventSelection) return;
        // get template for setting name
        const selection: ISelectionModel = await broker.sendRequest(CommunicationCodes.GET_SELECTION, {
            id: eventSelection.selection_id,
            lang_id: langId
        }, QueueType.MARKET_SERVICE);
        // set name
        if (selection) {
            eventSelection.name = selection.name;
            if (eventSelection.argument) eventSelection.name = eventSelection.name.replace(new RegExp("{X}", "g"), eventSelection.argument)
        };
        // return event selection
        return eventSelection;
    }

    async updateEventSelectionStatus(id: number, statusId: number) {
    }

    async getEventMarketSelections(eventMarketId: number, langId: number) {
        let eventSelections: any[] = await this.eventSelectionDAL.getEventMarketSelections(eventMarketId, langId);
        return this.getEventSelectionsTranslations(langId, eventSelections);
    }

    async getEventSelectionsTranslations(langId: number, eventSelections: IEventSelectionPublic[]): Promise<any[]> {
        const selections: ISelectionModel[] = await broker.sendRequest(CommunicationCodes.GET_SELECTIONS, {
            ids: eventSelections.map(s => { return s.selection_id }),
            lang_id: langId
        }, QueueType.MARKET_SERVICE);

        return reduce(eventSelections, (result: IEventSelectionPublic[], eventSelection: IEventSelectionPublic) => {
            result.push(eventSelection);
            let translation = selections.find(t => { return t.id == eventSelection.selection_id });
            if (!translation) return result;

            eventSelection.name = translation.name;

            if (eventSelection.argument) {
                eventSelection.name = eventSelection.name.replace('{X}', '(' + eventSelection.argument + ')');
            } else {
                eventSelection.name = eventSelection.name.replace('{X}', '');
            }

            eventSelection.row_index = translation.row_index;
            eventSelection.column_index = translation.column_index;
            
            return result;
        }, []);
    }
    async getEventSelections(eventSelectionsId: any[]): Promise<any[] | undefined> {
        if (eventSelectionsId.length == 0) return [];
        eventSelectionsId = eventSelectionsId.filter(es => { return es != "" });
        if (!isNummericArray(eventSelectionsId)) throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST);
        let eventSelections = await this.eventSelectionDAL.getEventSelections(eventSelectionsId);
        return this.getEventSelectionsTranslations(DEFAULT_LANGUAGE, eventSelections);
    }
}