/**
 * Created by   on 3/5/2017.
 */
import { IEventDAL } from "./abstract/IEventDAL";
import { ServiceBase } from "../../../../CommonJS/src/bll/services/ServiceBase";
import { QueryBuilder } from "../../../../CommonJS/src/base/base.model";
import { EventType } from "../../../../EventService/src/components/events/enums/event_type.enum";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";

export class EventDAL implements IEventDAL {
    addEvent(id: string, type: EventType, mapId: number, eventName: string, startDate: Date, status: EventStatus, sportId: string, countryId: string, leagueId: string) {
        const query = `insert into event (id, map_id, name, start_date, sport_id, country_id, league_id, status, type_id)
                      values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                    on conflict (id)
                    do update set (map_id, start_date, status) = ($2, $4, $8)
                    where event.id = $1;`;
        return ServiceBase.db.none(query, [id, mapId, eventName, startDate, sportId, countryId, leagueId, status, type]);
    }
    updateEvent(id: string, status: EventStatus) {
        const query = `update event
                        set status = $2
                        where id = $1`;
        return ServiceBase.db.none(query, [id, status]);
    }
    getEvents(type: EventType, startDateFrom: Date, startDateTo: Date): Promise<any[]> {
        const query = QueryBuilder("event")
            .whereBetween('start_date', [startDateFrom, startDateTo])
            .where('type_id', type)
        return ServiceBase.db.manyOrNone(query.toString());
    }
}