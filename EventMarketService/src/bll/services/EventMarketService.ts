/**
 * Created by   on 3/19/2017.
 */
import { map, each, reduce } from "bluebird";
import { groupBy, isNumber, isBoolean, isArray, uniq } from "lodash";
import { EventMarketDAL } from "../../dal/EventMarketDAL";
import { CommunicationCodes } from "../../../../CommonJS/src/messaging/CommunicationCodes";
import { DEFAULT_LANGUAGE } from "../../../../CommonJS/src/domain/constant";
import { ErrorUtil, ErrorCodes } from "../../../../CommonJS/src/messaging/ErrorCodes";
import { QueueType } from "../../../../CommonJS/src/messaging/QueueType";
import { isNullOrUndefined } from "util";
import { EventSelectionService } from "./EventSelectionService";
import { IMarketPublic } from "../../../../MarketService/src/components/markets/interfaces/market.interface"
import { broker } from "../../../../CommonJS/src/base/base.model";
import { EventMarketPublic } from "../../components/event.market/models/event.market.model";
import { EventSelectionPublic } from "../../components/event.selection/models/event.selection.model";
import { IProviderOdd, IEventSelectionPublic } from "../../components/event.selection/interfaces/event.selection.interface";
import { EventSelectionFilter } from "../../components/event.selection/filters/event.selection.filter";
import { IEventMarketPublic } from "../../components/event.market/interfaces/event.market.interface";

export class EventMarketService {
    private eventMarketDAL = new EventMarketDAL();
    private eventSelectionService = new EventSelectionService();

    async addEventMarket(eventId: number, marketId: number) {
        return this.eventMarketDAL.addEventMarket(eventId, marketId);
    }

    async getEventMarket(id: number, langId: number = DEFAULT_LANGUAGE) {
        let eventMarket = await this.eventMarketDAL.getEventMarket(id);
        if (!eventMarket) return;
        let eventMarkets: any[] = [];
        eventMarkets.push(eventMarket);
        await this.getEventMarketsTranslations(langId, eventMarkets);

        let selectionsWithOdds = await this.getEventMarketOdds(id);
        let selections: any[] = await this.eventSelectionService.getEventMarketSelections(eventMarket.id, langId);
        await each(selections, selection => {
            selection.odds = selectionsWithOdds[selection.id];
        });
        eventMarket.selections = selections;

        return eventMarket;
    }

    async updateEventMarketStatus(id: number, statusId: number) {
        return this.eventMarketDAL.updateEventMarketStatus(id, statusId);
    }

    async getEventMarkets(eventId: number, langId: number, excludeSelections: boolean, isTipster: boolean, scopeId?: number, statisticTypeId?: number) {
        if (!isNumber(Number(eventId))) throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST);
        let eventMarkets: any[] = await this.eventMarketDAL.getEventMarkets(eventId);
        eventMarkets = await this.getEventMarketsTranslations(langId, eventMarkets, isTipster, undefined, scopeId, statisticTypeId);

        return map(eventMarkets, async (eventMarket) => {
            if (!isNullOrUndefined(excludeSelections) && excludeSelections == true) return eventMarket;
            let selections = await this.eventSelectionService.getEventMarketSelections(eventMarket.id, langId);
            eventMarket.selections = selections;
            return eventMarket;
        })
    }

    async getEventsOnlyWithMarkets(events: any[], isTipsterDefault: boolean) {
        // validate request
        if (!isArray(events)) throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST);
        if (events.length === 0) return [];
        // get tipster markets
        let tipsterMarkets: IMarketPublic[] = [];
        if (isTipsterDefault) {
            tipsterMarkets = await broker.sendRequest(CommunicationCodes.GET_MARKETS, { is_tipser: true, is_tipster_default: true }, QueueType.MARKET_SERVICE);
        }
        // get event markets
        const eventsMarkets = await this.eventMarketDAL.getEventsOnlyWithMarkets(events.map(e => e.id), tipsterMarkets.map(m => m.id));
        // filter events
        return eventsMarkets.map(market => events.find(e => e.id == market.event_id));
    }

    async getEventsMarkets(eventIds: number[], langId: number, excludeSelections: boolean, isTipsterDefault: boolean) {
        if (eventIds.length == 0) return;
        let tipsterMarkets: IMarketPublic[] = [];
        if (isTipsterDefault) {
            tipsterMarkets = await broker.sendRequest(CommunicationCodes.GET_MARKETS, {
                is_tipser: true,
                is_tipster_default: true
            }, QueueType.MARKET_SERVICE);
        }
        const dbResult = await this.eventMarketDAL.getEventsMarkets(eventIds, isTipsterDefault ? tipsterMarkets.map(m => m.id) : undefined);
        let eventMarkets: IEventMarketPublic[] = [];
        await map(dbResult, async r => {
            let marketObj: any = {};
            let selectionObj: any = {};
            await map(Object.keys(r), async k => {
                if (k.indexOf("em.") != -1) {
                    marketObj[k.split("em.")[1]] = r[k];
                }
                if (k.indexOf("es.") != -1) {
                    selectionObj[k.split("es.")[1]] = r[k];
                }
            })

            let eventMarket = eventMarkets.find(em => em.id == marketObj.id);
            if (!eventMarket) {
                eventMarket = new EventMarketPublic(marketObj);
                eventMarkets.push(eventMarket);
            };
            eventMarket.selections.push(new EventSelectionPublic(selectionObj));
            return eventMarket;
        });
        eventMarkets = await this.getEventMarketsTranslations(langId, eventMarkets, true, isTipsterDefault);

        const s = {};
        eventMarkets.forEach(em => {
            em.selections.forEach(es => {
                if (!s[es.selection_id]) s[es.selection_id] = es;
            });
        });

        const eventSelections = await this.eventSelectionService.getEventSelectionsTranslations(langId, Object.keys(s).map(k => { return s[k]; }));

        await map(eventMarkets, async (eventMarket) => {
            if (excludeSelections != undefined && excludeSelections) return eventMarket;
            const bestSelections = await this.getBestOddsByEventMarketId(eventMarket.id, false);
            return map(eventMarket.selections, selection => {
                let selectionTranslate = eventSelections.find(s => { return s.selection_id == selection['selection_id'] });
                if (selectionTranslate) selection.name = selectionTranslate['name'];
                selection.odds.push(bestSelections[selection.id]);
            })
        })

        return eventMarkets;
    }

    async getEventsMarketsCount(eventsId: string[]): Promise<any> {
        return this.eventMarketDAL.getEventsMarketsCount(eventsId);
    }

    private async getEventMarketsTranslations(langId: number, eventMarkets: IEventMarketPublic[], isTipster?: Boolean, isTipsterDefault?: Boolean, scopeId?: number, statisticTypeId?: number) {
        const markets: IMarketPublic[] = await broker.sendRequest(CommunicationCodes.GET_MARKETS, {
            ids: uniq(eventMarkets.map(em => em.market_id)),
            lang_id: langId,
            is_tipster: isTipster,
            is_tipster_default: isTipsterDefault,
            scope_id: scopeId,
            statistic_type_id: statisticTypeId
        }, QueueType.MARKET_SERVICE);

        return await reduce(eventMarkets, async (result: IEventMarketPublic[], eventMarket) => {
            const name = markets.find(t => t.id == eventMarket.market_id);
            if (!name) return result;

            eventMarket.name = name.name;
            eventMarket.order_id = name.order_id;
            eventMarket.is_tipster = name.is_tipster;
            eventMarket.is_tipster_default = name.is_tipster_default;
            eventMarket.multi_winner = name.multi_winner;
            result.push(eventMarket);
            return result;
        }, []);
    }

    async getBestOddsByEventMarketId(eventMarketId: number, includeSelectionName: boolean = true): Promise<{ [key: number]: IProviderOdd }> {
        if (!isNumber(Number(eventMarketId) || !isBoolean(includeSelectionName))) throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST);
        const selections: IEventSelectionPublic[] = await this.getEventMarketOdds(eventMarketId);
        let selectionsNames: any[];
        if (includeSelectionName) {
            selectionsNames = await this.eventSelectionService.getEventSelectionsTranslations(DEFAULT_LANGUAGE, selections);
        }
        const bestSelections: { [key: number]: IProviderOdd } = {};
        await map(selections, async (selection) => {
            const bestSelection = selection.odds.reduce(function (prev, current) {
                return (prev.odd > current.odd) ? prev : current;
            });
            if (includeSelectionName) {
                bestSelection.name = selectionsNames.find(s => {
                    return s.id == bestSelection.id
                }).name;
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
        const keys = Object.keys(grouppedSelections).filter(a => !isNaN(Number(a)));
        // get event selections
        const eventSelections = await new EventSelectionFilter({ ids: keys.map(a => Number(a)) }).find();
        // return event selections with providers odds
        return map(eventSelections, async eventSelection => {
            eventSelection.odds = grouppedSelections[eventSelection.id];
            return eventSelection;
        })
    }

    public async deleteEventMarketsByEventsId(eventsId): Promise<any> {
        let deletedEventMarketsId = await this.eventMarketDAL.deleteEventMarketsByEventsId(eventsId);
        if (!isArray(deletedEventMarketsId) || deletedEventMarketsId.length == 0) return;
        deletedEventMarketsId = deletedEventMarketsId.map(em => { return em.id });
        return broker.sendRequest(CommunicationCodes.UN_MAP_EVENT_MARKETS_WITH_SELECTIONS, {
            event_markets_id: deletedEventMarketsId
        }, QueueType.MAPPING_SERVICE);
    }

    public async eventMarketCascadeDeleteByMarketId(marketId: number, unmap: boolean): Promise<any> {
        await this.eventMarketDAL.deleteEventMarketsByMarketId(marketId);
        if (unmap) {
            //unmap all markets and selections
            return broker.sendRequest(CommunicationCodes.UN_MAP_EVENT_MARKET_CASCADE_BY_MARKET_ID, {
                system_market_id: marketId, unmap_template: false
            }, QueueType.MAPPING_SERVICE);
        }
    }
}