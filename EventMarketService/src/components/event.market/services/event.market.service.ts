/**
 * Created by   on 3/19/2017.
 */
import { map } from "bluebird";
import { groupBy } from "lodash";
import { isNumber, isArray, isBoolean } from "util";
import { IEventMarket, IEventMarketPublic, IEventMarketCount } from "../interfaces/event.market.interface";
import { EventMarketFilter } from "../filters/event.market.filter";
import { EventMarket, EventMarketCount } from "../models/event.market.model";
import { ErrorUtil, ErrorCodes } from "../../../../../CommonJS/src/messaging/ErrorCodes";
import { CommunicationCodes } from "../../../../../CommonJS/src/messaging/CommunicationCodes";
import { broker } from "../../../../../CommonJS/src/base/base.model";
import { QueueType } from "../../../../../CommonJS/src/messaging/QueueType";
import { IMarketPublic } from "../../../../../MarketService/src/components/markets/interfaces/market.interface";
import { IEvent } from "../../../../../EventService/src/components/events/interfaces/event.interface";
import { EventSelectionFilter } from "../../event.selection/filters/event.selection.filter";
import { IEventSelectionPublic, IProviderOdd } from "../../event.selection/interfaces/event.selection.interface";

export class EventMarketService {
    async add(data: IEventMarket): Promise<IEventMarket> {
        // find event market
        const [eventMarket] = await new EventMarketFilter(data).find();
        // if event market found return it
        if (eventMarket) return eventMarket;
        // if event market does not exists create new one
        return new EventMarket(data).saveWithID(`on conflict ("event_id", "market_id") do update set event_id=${data.event_id} RETURNING *`);
    }

    async get(filter: EventMarketFilter): Promise<IEventMarketPublic | undefined> {
        // find event market
        const [eventMarket] = await this.list(filter);
        // if event market found return it
        eventMarket.selections = await this.getEventMarketOdds(eventMarket.id);
        return eventMarket;
    }

    async update(data: IEventMarket): Promise<IEventMarket> {
        return new EventMarket(data).update();
    }

    async list(filter: EventMarketFilter): Promise<IEventMarketPublic[]> {
        return new EventMarketFilter(filter).find();
    }

    async getEventsOnlyWithMarkets(events: IEvent[], isTipsterDefault: boolean): Promise<(IEvent | undefined)[]> {
        // validate request
        if (!isArray(events)) throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST);
        if (events.length === 0) return [];
        // get tipster markets
        let tipsterMarkets: IMarketPublic[] = [];
        if (isTipsterDefault) {
            tipsterMarkets = await broker.sendRequest(CommunicationCodes.GET_MARKETS, {
                is_tipser: true, is_tipster_default: true
            }, QueueType.MARKET_SERVICE);
        }
        // get event markets
        const eventsMarkets = await new EventMarketFilter({ event_ids: events.map(e => e.id), market_ids: tipsterMarkets.map(m => m.id) }).find();
        // filter events
        return map(eventsMarkets, async market => events.find(e => e.id == market.event_id));
    }

    async getEventsMarkets(filter: EventMarketFilter): Promise<IEventMarketPublic[] | undefined> {
        if (!filter.event_ids || filter.event_ids.length == 0) return;
        let tipsterMarkets: IMarketPublic[] = [];
        if (filter.is_tipster_default) {
            tipsterMarkets = await broker.sendRequest(CommunicationCodes.GET_MARKETS, { is_tipser: true, is_tipster_default: true }, QueueType.MARKET_SERVICE);
        }

        filter = new EventMarketFilter(filter);
        filter.market_ids = tipsterMarkets.map(m => m.id);

        const eventMarkets = await filter.find();

        await map(eventMarkets, async eventMarket => {
            if (!filter.include_selections) return eventMarket;
            let bestSelections = await this.getBestOddsByEventMarketId(eventMarket.id, false);
            return map(eventMarket.selections, async selection => {
                selection.odds.push(bestSelections[selection.id]);
            })
        })

        return eventMarkets;
    }

    async getEventsMarketsCount(filter: EventMarketFilter): Promise<IEventMarketCount[]> {
        // get event markets
        const eventMarkets = await new EventMarketFilter(filter).find();
        // group by event_id
        const eventMarketsByEventId = groupBy(eventMarkets, 'event_id');
        // return event markets counts by event id
        return map(Object.keys(eventMarketsByEventId), async key =>
            new EventMarketCount({ event_id: Number(key), count: eventMarketsByEventId[key].length }))
    }

    async getBestOddsByEventMarketId(eventMarketId: number, includeSelectionName: boolean = true): Promise<{ [id: number]: IProviderOdd }> {
        if (!isNumber(Number(eventMarketId) || !isBoolean(includeSelectionName))) throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST);
        const selections = await this.getEventMarketOdds(eventMarketId);
        let selectionsNames: IEventSelectionPublic[];
        if (includeSelectionName) {
            selectionsNames = await new EventSelectionFilter({ ids: selections.map(s => s.selection_id) }).find();
        }
        const bestSelections: { [id: number]: IProviderOdd } = {};
        await map(selections, async (selection) => {
            const bestSelection = selection.odds.reduce(function (prev, current) {
                return (prev.odd > current.odd) ? prev : current;
            });
            if (includeSelectionName) {
                const selection = selectionsNames.find(s => {
                    return s.id === bestSelection.id
                });
                if (selection) bestSelection.name = selection.name;
            };
            bestSelections[bestSelection.id] = bestSelection;
        });
        return bestSelections;
    }

    async getEventMarketOdds(eventMarketId: number): Promise<IEventSelectionPublic[]> {
        if (!isNumber(Number(eventMarketId))) throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST);
        const providersSelections: IProviderOdd[] = await broker.sendRequest(CommunicationCodes.GET_PROVIDERS_ODDS_BY_SELECTIONS_IDS, {
            event_market_id: eventMarketId
        }, QueueType.MAPPING_SERVICE);
        //if selections not found for provided eventMarketId
        if (!isArray(providersSelections) || providersSelections.length == 0) return [];
        // group selections by selections ids
        const grouppedSelections = groupBy(providersSelections, 'id');
        // get event selections
        const eventSelections = await new EventSelectionFilter({ ids: Object.keys(grouppedSelections).map(a => Number(a)) }).find();
        // return event selections with providers odds
        return map(eventSelections, async eventSelection => {
            eventSelection.odds = grouppedSelections[eventSelection.id];
            return eventSelection;
        })
    }

    public async deleteEventMarketsByEventsId(eventsId: number[]): Promise<any> {
        const deletedEventMarketsId = await EventMarket.deleteMany(<any>EventMarket, "event_id", eventsId);
        if (!isArray(deletedEventMarketsId) || deletedEventMarketsId.length == 0) return;
        // unmap deleted event markets
        return broker.sendRequest(CommunicationCodes.UN_MAP_EVENT_MARKETS_WITH_SELECTIONS, {
            event_markets_id: deletedEventMarketsId.map(em => { return em.id })
        }, QueueType.MAPPING_SERVICE);
    }

    public async eventMarketCascadeDeleteByMarketId(marketId: number, unmap: boolean): Promise<any> {
        await EventMarket.delete(<any>EventMarket, { "market_id": marketId });
        if (unmap) {
            //unmap all markets and selections
            return broker.sendRequest(CommunicationCodes.UN_MAP_EVENT_MARKET_CASCADE_BY_MARKET_ID,
                { system_market_id: marketId, unmap_template: false }, QueueType.MAPPING_SERVICE);
        }
    }
}