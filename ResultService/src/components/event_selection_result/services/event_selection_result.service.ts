/**
 * Created by   on 3/1/2017.
 */
import { IEventSelectionResult } from "../interfaces/event_selection_result.interface";
import { EventSelectionResultFilter } from "../filters/event_selection_result.filter";
import { EventSelectionResult } from "../models/event_selection_result.model";
import { map } from "bluebird";

export class EventSelectionResultService {
    async add(data: IEventSelectionResult): Promise<IEventSelectionResult> {
        // find exising category
        let [eventSelectionResult] = await new EventSelectionResultFilter({ id: data.id }).find();
        // if category found
        if (eventSelectionResult) return eventSelectionResult.update(data);
        // create new category
        return new EventSelectionResult(data).saveWithID();
    }

    async list(filter: EventSelectionResultFilter): Promise<IEventSelectionResult[]> {
        return new EventSelectionResultFilter(filter).find();
    }

    async update(data: IEventSelectionResult): Promise<IEventSelectionResult | undefined> {
        // find result
        const result = <EventSelectionResult | undefined>await EventSelectionResult.findOne(<any>EventSelectionResult, { id: data.id })
        // if result not found return
        if (!result) return undefined;
        // update result
        return result.update(data);
    }

    async updateMany(data: IEventSelectionResult[]): Promise<(IEventSelectionResult | undefined)[]> {
        return map(data, async r => this.update(r));
    }

    async delete(data: IEventSelectionResult): Promise<any> {
        return EventSelectionResult.delete(<any>EventSelectionResult, data);
    }
}