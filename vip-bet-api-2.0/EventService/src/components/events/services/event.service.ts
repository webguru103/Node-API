/**
 * Created by   on 3/19/2017.
 */
// import { ErrorCodes, ErrorUtil } from "../../../../../CommonJS/src/messaging/ErrorCodes";
import { QueueType } from "../../../../../CommonJS/src/messaging/QueueType";
import { ErrorCodes, ErrorUtil } from "../../../../../CommonJS/src/messaging/ErrorCodes";
import { CommunicationCodes } from "../../../../../CommonJS/src/messaging/CommunicationCodes";
import { Event } from "../models/event.model";
import { Category } from "../../../../../CategoryService/src/components/category/models/category.model";
import { CategoryFilter } from "../../../../../CategoryService/src/components/category/filters/category.filter";
import { DEFAULT_LANGUAGE, MIN_DATE } from "../../../../../CommonJS/src/domain/constant";
import { QueryBuilder, BaseModel, broker } from "../../../../../CommonJS/src/base/base.model";
import { EventFilter } from "../filters/event.filter";
import { countBy, toNumber, isArray } from "lodash";
import { IEvent } from "../interfaces/event.interface";
import { CategoryType } from "../../../../../CategoryService/src/components/category/enums/category_type.enum";
import { EventStatus } from "../enums/event_status.enum";
import { EventType } from "../enums/event_type.enum";

export class EventService {
    async add(data: IEvent): Promise<Event> {
        if (!data.start_date) throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST, "event start date is missing");
        // sort participant ids in nummeric order
        data.participants = data.participants.map(p => toNumber(p));
        // search in 2 hour interval to avoid providers time problems
        // -2 hours
        const date_from: Date = new Date(data.start_date);
        date_from.setHours(date_from.getHours() - 30);
        // +2 hours
        const date_to: Date = new Date(data.start_date);
        date_to.setHours(date_to.getHours() + 30);
        // find event
        const [event] = await new EventFilter({
            date_from: date_from.toISOString(),
            date_to: date_to.toISOString(),
            participants: data.participants,
            start_date_from_day_start: false,
            start_date_to_day_end: false
        }).find();
        // if found update otherwise create new one
        if (event) {
            return event.update(data);
        } else {
            return new Event(data).saveWithID();
        }
    };

    async get(filter: Partial<EventFilter>): Promise<IEvent> {
        (filter as EventFilter).date_from = MIN_DATE;
        const [event] = await this.list(filter);
        return event;
    }

    async list(filter: Partial<EventFilter>): Promise<IEvent[]> {
        return new EventFilter(filter).find();
    }

    async getEventsWithTipsterDefaultMarket(filter: EventFilter, result: IEvent[] = []): Promise<IEvent[]> {
        //normalize filter
        filter = new EventFilter(filter);
        //set default language if lang_id was not providede
        filter.lang_id = filter.lang_id || DEFAULT_LANGUAGE;
        filter.include_markets = true;
        filter.start_date_from_day_start = false;
        filter.date_from = new Date();
        if (filter.page === undefined || toNumber(filter.page) === 0) filter.page = 1;
        //get events by time depending on filter
        let events = await this.list(filter);
        events = events.filter(e => isArray(e.markets) && e.markets.length > 0);
        //if there are no events to return then return empty list
        if (events.length == 0) return result;
        //append events
        result = result.concat(events);
        result = result.slice(0, filter.limit);
        //call recursive to fill required count of events;
        if (result.length != filter.limit) {
            filter.page++;
            return this.getEventsWithTipsterDefaultMarket(filter, result);
        }
        //return events with markets
        return result;
    }

    async getEventCategoriesByTimeRange(filter: CategoryFilter) {
        const events = await this.list({ parent_id: filter.parent_id, parent_type: filter.parent_type, limit: 10000000, status: EventStatus.ACTIVE });
        // get events only with market 
        const eventsWithMarketsOnly = await broker.sendRequest(CommunicationCodes.GET_EVENTS_WITH_MARKETS_ONLY, {
            events: events.map(e => new Event(<any>{
                id: e.id,
                sport_id: e.sport_id,
                country_id: e.country_id,
                league_id: e.league_id
            })),
            is_tipster_default: true
        }, QueueType.EVENT_MARKET_SERVICE);
        if (!eventsWithMarketsOnly || eventsWithMarketsOnly.length == 0) return [];
        // group events to get catgory ids
        let grouped = {};
        if (!filter.parent_type && !filter.parent_id) {
            grouped = countBy(eventsWithMarketsOnly, 'sport_id');
        } else if (filter.parent_type == CategoryType.SPORT) {
            grouped = countBy(eventsWithMarketsOnly, 'country_id');
        } else if (filter.parent_type == CategoryType.SPORT_COUNTRY) {
            grouped = countBy(eventsWithMarketsOnly, 'league_id');
        }
        // return category id and count
        return Object.keys(grouped).map(id => {
            return {
                id: id,
                count: grouped[id]
            }
        })
    }

    public async moveEventsToLeague(from: number, to: number, countryId: number): Promise<any> {
        if (!from || !to) return;
        let query = QueryBuilder(Event.tableName).where("league_id", "=", from).update({ league_id: to, country_id: countryId });
        await BaseModel.db.none(query.toString());
    }

    public async deleteSportEvents(sportId: number): Promise<any> {
        if (!sportId) return;
        return this.deleteEvents({ sport_id: sportId });
    }

    public async deleteCountryEvents(countryId: number): Promise<any> {
        if (!countryId) return;
        return this.deleteEvents({ country_id: countryId });
    }

    public async deleteLeagueEvents(leagueId: number): Promise<any> {
        if (!leagueId) return;
        return this.deleteEvents({ league_id: leagueId });
    }

    private async deleteEvents(data: any): Promise<any> {
        //select events id
        let query = QueryBuilder(Event.tableName).where(data).select("id").toString();
        const eventsId: IEvent[] = await BaseModel.db.manyOrNone(query);
        if (eventsId.length == 0) return;
        //delete events
        query = `with cte as (select dict_id from events where id in ($1:csv))
                 delete from translations where dict_id in (select dict_id from cte);

                 delete from events where id in ($1:csv) returning events.id;`;

        let deletedEvents = await BaseModel.db.manyOrNone(query, [eventsId.map(ev => ev.id)]);
        deletedEvents = deletedEvents.map(ev => ev.id);
        await broker.sendRequest(CommunicationCodes.DELETE_EVENT_MARKETS, { events_id: deletedEvents }, QueueType.EVENT_MARKET_SERVICE);
        await broker.sendRequest(CommunicationCodes.UN_MAP_EVENTS, { events_id: deletedEvents }, QueueType.MAPPING_SERVICE);
        return deletedEvents;
    }

    public async updateCategoryStatus(category: Category): Promise<any> {
        let query = QueryBuilder(Event.tableName);
        switch (category.type_id) {
            case CategoryType.SPORT:
                query.where("sport_id", "=", category.id).update({ sport_status_id: category.status_id });
                break;
            case CategoryType.SPORT_COUNTRY:
                query.where("country_id", "=", category.id).update({ country_status_id: category.status_id });
                break;
            case CategoryType.LEAGUE:
                query.where("league_id", "=", category.id).update({ league_status_id: category.status_id });
                break;
        }
        return BaseModel.db.any(query.toString());
    }

    public async closePrematchStartedEvents(): Promise<void> {
        let query = QueryBuilder(Event.tableName)
            .update({ status: EventStatus.CLOSED })
            .where("type_id", EventType.PRE_MATCH)
            .where("start_date", "<", new Date())
            .where("status", "<>", EventStatus.CLOSED);
        await BaseModel.db.none(query.toString());
    }
}