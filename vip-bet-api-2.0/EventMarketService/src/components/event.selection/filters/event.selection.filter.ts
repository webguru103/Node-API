import { IEventSelectionPublic } from "../interfaces/event.selection.interface";
import { QueryBuilder, BaseModel, broker } from "../../../../../CommonJS/src/base/base.model";
import { EventSelection, EventSelectionPublic } from "../models/event.selection.model";
import { ISelectionModel } from "../../../../../MarketService/src/components/selections/interfaces/selection.interface";
import { CommunicationCodes } from "../../../../../CommonJS/src/messaging/CommunicationCodes";
import { map } from "bluebird";
import { QueueType } from "../../../../../CommonJS/src/messaging/QueueType";
import { uniq } from "lodash";
import { DEFAULT_LANGUAGE } from "../../../../../CommonJS/src/domain/constant";
import { EventStatus } from "../../../../../EventService/src/components/events/enums/event_status.enum";

export class EventSelectionFilter {
    id?: number;
    ids?: number[];
    event_market_id?: number;
    event_market_ids?: number[];
    event_id?: number;
    event_ids?: number[];
    status_id?: EventStatus;
    selection_id?: number;
    argument?: string;
    lang_id?: number;

    constructor(filter: Partial<EventSelectionFilter>) {
        this.id = filter.id;
        this.ids = filter.ids;
        this.event_id = filter.event_id;
        this.event_ids = filter.event_ids;
        this.event_market_id = filter.event_market_id;
        this.event_market_ids = filter.event_market_ids;
        this.status_id = filter.status_id;
        this.argument = filter.argument;
        this.lang_id = filter.lang_id || DEFAULT_LANGUAGE;

        // remove duplicates
        if (this.ids) this.ids = uniq(this.ids);
        if (this.event_ids) this.ids = uniq(this.event_ids);
        if (this.event_market_ids) this.event_market_ids = uniq(this.event_market_ids);
    }

    public async find(): Promise<IEventSelectionPublic[]> {
        const query = QueryBuilder(EventSelection.tableName);
        if (this.id) query.where(EventSelection.tableName + ".id", "=", this.id);
        if (this.ids) query.whereIn(EventSelection.tableName + ".id", this.ids);
        if (this.event_id) query.where(EventSelection.tableName + ".event_id", "=", this.event_id);
        if (this.event_ids) query.whereIn(EventSelection.tableName + ".event_id", this.event_ids);
        if (this.event_market_id) query.where(EventSelection.tableName + ".event_market_id", "=", this.event_market_id);
        if (this.event_market_ids) query.whereIn(EventSelection.tableName + ".event_market_id", this.event_market_ids);
        if (this.status_id) query.where(EventSelection.tableName + ".status_id", "=", this.status_id);
        if (this.argument) query.where(EventSelection.tableName + ".argument", "=", this.argument);
        // get data from db
        const queryString = query.toString();
        const output = await BaseModel.db.manyOrNone(queryString);
        // wrap data
        let eventSelections: IEventSelectionPublic[] = await map(output, async em => new EventSelectionPublic(<IEventSelectionPublic>em));
        // if language id is not provided return current list
        if (this.lang_id === undefined) return eventSelections;
        // get selections templates
        const selections: ISelectionModel[] = await broker.sendRequest(CommunicationCodes.GET_SELECTIONS, {
            ids: eventSelections.map(s => { return s.selection_id }),
            lang_id: this.lang_id
        }, QueueType.MARKET_SERVICE);
        // return event selections with names and other properties
        return map(eventSelections, async eventSelection => {
            // find template
            let selection = selections.find(t => { return t.id == eventSelection.selection_id });
            // if template not found return without template properties
            if (!selection) return eventSelection;
            // set translated name
            eventSelection.name = selection.name;
            // replace argument if it exists
            if (eventSelection.argument) {
                eventSelection.name = eventSelection.name.replace('{X}', '(' + eventSelection.argument + ')');
            } else {
                eventSelection.name = eventSelection.name.replace('{X}', '');
            }
            // set row and column indexes
            eventSelection.row_index = selection.row_index;
            eventSelection.column_index = selection.column_index;
            // return event selection
            return eventSelection;
        });
    }
}