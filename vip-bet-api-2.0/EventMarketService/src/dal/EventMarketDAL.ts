/**
 * Created by   on 3/19/2017.
 */
import { BaseModel } from "../../../CommonJS/src/base/base.model";
import { EventStatus } from "../../../EventService/src/components/events/enums/event_status.enum";

export class EventMarketDAL {
    async getEventsOnlyWithMarkets(eventId: number[], tipsterDefaultMarkets?: number[]) {
        let query = `select distinct em.event_id
                        from event_market as em
                        join event_selection as es on es.event_market_id = em.id
                            where em.event_id in ($1:csv)`;

        if (tipsterDefaultMarkets) {
            query += ` and em.market_id in ($2:csv)`;
        }

        return BaseModel.db.manyOrNone(query, [eventId, tipsterDefaultMarkets]);
    }
    async addEventMarket(eventId: number, marketId: number) {
        let query = `insert into event_market(event_id, market_id) values ($1, $2)
                        on conflict ("event_id", "market_id") do update set event_id=$1 RETURNING id;`;

        let res = await BaseModel.db.one(query, [eventId, marketId]);
        return res.id;
    }

    async getEventMarket(id: number) {
        let query = `select id, status_id, market_id, event_id from event_market where id = $1`;

        return BaseModel.db.oneOrNone(query, [id]);
    }

    async updateEventMarketStatus(id: number, statusId: EventStatus) {
        let query = `update event_market
                        set status_id = $2
                        where id = $1`;

        return BaseModel.db.none(query, [id, statusId]);
    }

    async getEventMarkets(eventId: number) {
        let query = `select id, status_id, market_id from event_market
                       where event_id = $1
                       order by market_id`;

        return BaseModel.db.manyOrNone(query, [eventId]);
    }

    async getEventsMarkets(eventId: number[], tipsterDefaultMarkets: number[] | undefined) {
        let query = `select em.id as "em.id",
                            em.status_id as "em.status_id", 
                            em.market_id as "em.market_id", 
                            em.event_id as "em.event_id", 
                            es.id as "es.id", 
                            es.odd as "es.odd", 
                            es.status_id as "es.status_id",
                            es.selection_id as "es.selection_id", 
                            es.argument as "es.argument"
                        from event_market as em
                        join event_selection as es on es.event_market_id = em.id
                            where em.event_id in ($1:csv)`;

        if (tipsterDefaultMarkets && tipsterDefaultMarkets.length > 0) {
            query += `and em.market_id in ($2:csv)`;
        }

        query += `order by em.market_id`;

        return BaseModel.db.manyOrNone(query, [eventId, tipsterDefaultMarkets]);
    }

    async getEventsMarketsCount(eventIds: string[]) {
        if (eventIds.length == 0) return [];
        let query = `select count(*),event_market.event_id  from event_market
                       where event_market.event_id in ($1:csv)
                       group by event_market.event_id`;

        return BaseModel.db.manyOrNone(query, [eventIds]);
    }

    public async deleteEventMarketsByEventsId(eventsId: number[]): Promise<any[]> {
        if (eventsId.length == 0) return [];
        let query = `with cte as (select distinct id from event_market where event_id in ($1:csv))
                     delete from event_selection where event_market_id in (select id from cte);
                     delete from event_market where event_id in ($1:csv) returning event_market.id;`;

        return BaseModel.db.manyOrNone(query, [eventsId]);
    }

    public async deleteEventMarketsByMarketId(marketId: number): Promise<any[]> {
        let query = `with cte as (select id from event_market where market_id = ${marketId})
                     delete from event_selection where event_market_id in (select id from cte);
                     delete from event_market where market_id = ${marketId};`;

        return BaseModel.db.none(query);
    }
}