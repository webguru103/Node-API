/**
 * Created by   on 3/19/2017.
 */
import { EventSelectionFilter } from "../filters/event.selection.filter";
import { IEventSelectionPublic, IEventSelection } from "../interfaces/event.selection.interface";
import { EventSelection } from "../models/event.selection.model";

export class EventSelectionService {

    async addEventSelection(data: IEventSelection): Promise<IEventSelection> {
        return new EventSelection(data).saveWithID();
    }

    async getEventSelection(filter: EventSelectionFilter): Promise<IEventSelectionPublic> {
        const [eventSelection] = await this.getEventSelections(filter);
        return eventSelection;
    }

    async updateEventSelectionStatus(data: IEventSelection): Promise<IEventSelection> {
        return new EventSelection(data).update();
    }

    async getEventSelections(filter: EventSelectionFilter): Promise<IEventSelectionPublic[]> {
        return new EventSelectionFilter(filter).find();
    }
}