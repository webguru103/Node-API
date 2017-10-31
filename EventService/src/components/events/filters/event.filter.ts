import { Event } from "../models/event.model";
import { BaseModel, QueryBuilder, broker } from "../../../../../CommonJS/src/base/base.model";
import { MAX_DATE, DEFAULT_LANGUAGE } from "../../../../../CommonJS/src/domain/constant";
import { NormalizeOffset, NormalizeLimit } from "../../../../../CommonJS/src/utils/utils";
import { map } from "bluebird";
import { toNumber, isString, groupBy, uniq } from "lodash";
import { IEvent } from "../interfaces/event.interface";
import { Translate } from "../../../../../CommonJS/src/components/translates/models/translate.model";
import { CommunicationCodes } from "../../../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../../../CommonJS/src/messaging/QueueType";
import { Provider } from "../../../../../CommonService/src/components/provider/models/provider.model";
import { IEventMarketPublic } from "../../../../../EventMarketService/src/components/event.market/interfaces/event.market.interface";
import { CategoryStatus } from "../../../../../CategoryService/src/components/category/enums/category_status.enum";
import { CategoryType } from "../../../../../CategoryService/src/components/category/enums/category_type.enum";
import { EventType } from "../enums/event_type.enum";
import { EventStatus } from "../enums/event_status.enum";

export class EventFilter {
    public id?: number;
    public ids?: number[];
    public participants?: number[];
    public start_date?: Date;
    public date_from: Date | string;
    public date_to: Date | string;
    public name?: string;
    public lang_id: number;
    public sport_id?: number;
    public sport_status_id?: CategoryStatus;
    public country_id?: number;
    public country_status_id?: CategoryStatus;
    public league_id?: number;
    public league_status_id?: CategoryStatus;
    public type_id?: EventType
    public status?: EventStatus
    public active_only?: boolean;
    public include_market_counts?: boolean;
    public include_markets?: boolean;
    public include_category_names?: boolean;
    public parent_id?: number | null | undefined;
    public parent_type?: CategoryType | null;
    public start_date_from_day_start?: boolean;
    public start_date_to_day_end?: boolean;
    public is_finished?: boolean;
    public page: number;
    public limit: number;

    constructor(filter: Partial<EventFilter>) {
        this.id = filter.id;
        this.ids = filter.ids;
        this.participants = filter.participants;
        this.start_date = filter.start_date;
        // dates
        this.date_from = filter.date_from === undefined ? new Date() : filter.date_from;
        if (isString(this.date_from)) this.date_from = new Date(this.date_from);

        this.start_date_from_day_start = filter.start_date_from_day_start === undefined ? true : filter.start_date_from_day_start;
        if (this.start_date_from_day_start) this.date_from.setHours(0, 0, 0, 0);

        this.date_to = filter.date_to === undefined ? MAX_DATE : filter.date_to;
        if (isString(this.date_to)) this.date_to = new Date(this.date_to);

        this.start_date_to_day_end = filter.start_date_to_day_end === undefined ? true : filter.start_date_to_day_end;
        if (this.start_date_to_day_end) this.date_to.setHours(23, 59, 59, 999);
        // 
        this.name = filter.name;
        this.lang_id = toNumber(filter.lang_id) || DEFAULT_LANGUAGE;
        this.sport_id = filter.sport_id;
        this.sport_status_id = filter.sport_status_id;
        this.country_id = filter.country_id;
        this.country_status_id = filter.country_status_id;
        this.league_id = filter.league_id;
        this.league_status_id = filter.league_status_id;
        this.type_id = filter.type_id;
        this.status = filter.status;
        this.active_only = isString(filter.active_only) ? JSON.parse(filter.active_only) : true;
        this.include_markets = isString(filter.include_markets) ? JSON.parse(filter.include_markets) : filter.include_markets;
        this.include_market_counts = isString(filter.include_market_counts) ? JSON.parse(filter.include_market_counts) : filter.include_market_counts;
        this.include_category_names = isString(filter.include_category_names) ? JSON.parse(filter.include_category_names) : filter.include_category_names;
        this.parent_id = filter.parent_id;
        this.parent_type = filter.parent_type;
        this.is_finished = isString(filter.is_finished) ? JSON.parse(filter.is_finished) : filter.is_finished;
        // normalize page and limit
        this.page = toNumber(filter.page || 1);
        if (filter.limit !== undefined && filter.limit > 0) this.limit = filter.limit;
        else this.limit = NormalizeLimit(filter.limit);
    }

    public async find(): Promise<IEvent[]> {
        const query = QueryBuilder(Event.tableName)
            .join(Translate.tableName + " as tr", "tr.dict_id", "events.dict_id")
            .leftJoin(Translate.tableName + " as tr2", QueryBuilder.raw(`tr2.dict_id = tr.dict_id and tr2.lang_id = ${this.lang_id}`))
            .where("tr.lang_id", DEFAULT_LANGUAGE)
            .orderBy('events.start_date')
            .orderBy('events.id', 'desc')
            .limit(this.limit)
            .offset(NormalizeOffset(this.page - 1) * this.limit)
            .select('events.*')
            .select(QueryBuilder.raw('coalesce(tr2.translation, tr.translation) as name'))
            .select(QueryBuilder.raw('count(' + Event.tableName + '.*) OVER() AS full_count'))

        if (this.is_finished) {
            this.status = EventStatus.CLOSED;
            query.where("start_date", "<", "now()");
        }
        else query.whereBetween("start_date", [this.date_from, this.date_to]);

        if (this.id) query.where(Event.tableName + ".id", this.id)
        if (this.ids) query.whereIn(Event.tableName + ".id", this.ids)
        if (this.type_id) query.where(Event.tableName + ".type_id", this.type_id)
        if (this.status) query.where(Event.tableName + ".status", this.status)
        if (this.sport_id) query.where(Event.tableName + ".sport_id", this.sport_id)
        if (this.sport_status_id) query.where(Event.tableName + ".sport_status_id", this.sport_status_id)
        if (this.country_id) query.where(Event.tableName + ".country_id", this.country_id)
        if (this.country_status_id) query.where(Event.tableName + ".country_status_id", this.country_status_id)
        if (this.league_id) query.where(Event.tableName + ".league_id", this.league_id)
        if (this.league_status_id) query.where(Event.tableName + ".league_status_id", this.league_status_id)
        if (this.name) query.where(QueryBuilder.raw(`(lower(tr2.translation) ilike ? or lower(tr.translation) ilike ?)`, [this.name, this.name].map(n => "%" + n + "%")));
        if (this.participants) query.where(Event.tableName + ".participants", this.participants);
        if (this.parent_id && this.parent_type == CategoryType.SPORT) {
            query.where('sport_id', this.parent_id);
        } else if (this.parent_id && this.parent_type == CategoryType.SPORT_COUNTRY) {
            query.where('country_id', this.parent_id);
        }

        if (this.active_only) {
            query
                .where(Event.tableName + '.sport_status_id', CategoryStatus.ACTIVE)
                .where(Event.tableName + '.country_status_id', CategoryStatus.ACTIVE)
                .where(Event.tableName + '.league_status_id', CategoryStatus.ACTIVE)
        }
        const result = await BaseModel.db.manyOrNone(query.toString());
        const events = await map(result, async (event: any) => new Event(event));
        const eventIds = events.map(e => { return e.id });
        if (this.include_category_names) {
            // all category ids
            let category_ids: string[] = Object.keys(groupBy(events, 'sport_id')).concat(Object.keys(groupBy(events, 'country_id')), Object.keys(groupBy(events, 'league_id')));
            // take unique ids
            category_ids = uniq(category_ids);
            // get categories
            const categories = await broker.sendRequest(CommunicationCodes.GET_CATEGORIES, {
                ids: category_ids, lang_id: this.lang_id
            }, QueueType.CATEGORY_SERVICE);
            // set category names
            await map(events, async event => {
                const sport = categories.find(c => c.id == event.sport_id);
                if (sport) event.sport_name = sport.name;

                const country = categories.find(c => c.id == event.country_id);
                if (country) event.country_name = country.name;

                const league = categories.find(c => c.id == event.league_id);
                if (league) event.league_name = league.name;
            })
        }

        if (this.include_market_counts) {
            const counts = await broker.sendRequest(CommunicationCodes.GET_EVENT_MARKETS_COUNT, {
                events_id: eventIds
            }, QueueType.EVENT_MARKET_SERVICE);
            // set markets count
            await map(events, event => {
                let count = counts.find(c => c.event_id == event.id);
                if (count) event.markets_count = count['count'];
            });
        }

        if (this.include_markets) {
            //get events markets
            const markets: IEventMarketPublic[] = await broker.sendRequest(CommunicationCodes.GET_EVENTS_MARKETS, {
                events_id: eventIds,
                lang_id: this.lang_id,
                is_tipster_default: true
            }, QueueType.EVENT_MARKET_SERVICE);

            //find event markets 
            await map(events, async event => {
                const eventMarkets = markets.filter(market => {
                    return market['event_id'] == event['id'];
                });
                // in case of some events does not have markets dont include that events in result list
                if (eventMarkets) {
                    event.markets = eventMarkets;
                }
            });
        }
        // get providers
        const providers: { [key: string]: Provider[] } = await broker.sendRequest(CommunicationCodes.GET_EVENTS_PROVIDERS, eventIds, QueueType.MAPPING_SERVICE);
        // set providers to events
        await map(events, async event => {
            if (providers[event.id] === undefined) return;
            event.providers = providers[event.id].map(p => <any>{
                id: p.id,
                name: p.name,
                icon_url: p.icon_url
            });
        })
        // return events
        return events;
    }
}