/**
 * Created by   on 3/5/2017.
 */
import { IEventMarketDAL } from "./abstract/IEventMarketDAL";
import { ServiceBase } from "../../../../CommonJS/src/bll/services/ServiceBase";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";

export class EventMarketDAL implements IEventMarketDAL {
    addEventMarket(id: string, name: string, status: EventStatus, eventId: string, marketTypeId: string, mapId: number) {
        let query = `insert into event_market (id, name, event_id, market_id, map_id, status)
                      values($1, $2, $3, $4, $5, $6)
                    on conflict (id)
                    do update set (map_id, status) = ($5, $6)
                    where event_market.id = $1;`;
        return ServiceBase.db.none(query, [id, name, eventId, marketTypeId, mapId, status]);
    }

    updateEventMarket(id: string, status: EventStatus) {
        let query = `update event_market
                        set status=$2
                        where id = $1`;
        return ServiceBase.db.none(query, [id, status])
    }
}