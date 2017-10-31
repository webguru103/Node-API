/**
 * Created by   on 3/19/2017.
 */
import { BaseModel } from "../../../CommonJS/src/base/base.model";
import { IEventSelectionPublic, IEventSelection } from "../components/event.selection/interfaces/event.selection.interface";
import { EventStatus } from "../../../EventService/src/components/events/enums/event_status.enum";

export class EventSelectionDAL {
    async addEventSelection(eventMarketId: number, selectionId: number, argument: number, statusId: EventStatus) {
        const query = `insert into event_selection(event_market_id, selection_id, status_id, odd, argument) values ($1, $2, $3, $4, $5)
                        on conflict ("event_market_id", "selection_id", "argument") do update set status_id=$3 RETURNING id;`;

        const eventSelection = await BaseModel.db.one(query, [eventMarketId, selectionId, statusId, 0, argument]);
        return eventSelection.id;
    }

    async getEventSelection(id: number) {
        const query = `select id, odd, status_id, selection_id, event_market_id,argument from event_selection where id = $1`;
        return BaseModel.db.oneOrNone(query, [id]);
    }

    async updateEventSelectionStatus(id: number, statusId: number) {
        const query = `update event_selection
                        set status_id = $2
                        where id = $1`;
        return BaseModel.db.none(query, [id, statusId]);
    }

    async getEventMarketSelections(eventMarketId: number, lang_id: number): Promise<IEventSelection[]> {
        const query = `select id, odd, status_id, selection_id, argument from event_selection
                       where event_market_id = $1`;
        return BaseModel.db.manyOrNone(query, [eventMarketId]);
    }

    async getEventSelections(eventSelections: any[]): Promise<IEventSelectionPublic[]> {
        if (eventSelections.length == 0) return [];
        const query = ` select distinct event_selection.*, event_market.event_id from event_selection
                        join event_market on event_market.id = event_selection.event_market_id
                        where event_selection.id in ($1:csv)`;
        return BaseModel.db.manyOrNone(query, [eventSelections]);
    }
}