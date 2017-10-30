import { IEventMarketOutcomeDAL } from "./abstract/IEventMarketOutcomeDAL";
import { ServiceBase } from "../../../../CommonJS/src/bll/services/ServiceBase";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";
/**
 * Created by   on 3/5/2017.
 */
export class EventMarketOutcomeDAL implements IEventMarketOutcomeDAL {
    addEventMarketOutcome(id: string, mapId: number, name: string, eventMarketId: string, odd: number, status: EventStatus, argument: string) {
        let query = `insert into event_selection (id, name, map_id, event_market_id, odd, status, argument)
                      values($1, $2, $3, $4, $5, $6, $7)
                    on conflict (event_market_id, name, argument)
                    do update set (map_id, odd, status) = ($3, $5, $6);`;
        return ServiceBase.db.none(query, [id, name, mapId, eventMarketId, odd, status, argument || "0.00"]);
    }

    getEventMarketOutcome(id: string) {
        let query = `select * from event_selection where id = $1`;
        return ServiceBase.db.oneOrNone(query, [id]);
    }

    updateEventMarketOutcome(id: string, odd: number, status: EventStatus, mapId: number) {
        let query = `update event_selection 
                    set odd = $2, status=$3, map_id=$4
                    where id = $1`;
        return ServiceBase.db.none(query, [id, odd, status, mapId]);
    }
}