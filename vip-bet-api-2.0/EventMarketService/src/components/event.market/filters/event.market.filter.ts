import { IEventMarketPublic } from "../interfaces/event.market.interface";
import { QueryBuilder, BaseModel, broker } from "../../../../../CommonJS/src/base/base.model";
import { EventMarket, EventMarketPublic } from "../models/event.market.model";
import { DEFAULT_LANGUAGE } from "../../../../../CommonJS/src/domain/constant";
import { isString, groupBy, uniq } from "lodash";
import { EventSelectionFilter } from "../../event.selection/filters/event.selection.filter";
import { map } from "bluebird";
import { IMarketPublic } from "../../../../../MarketService/src/components/markets/interfaces/market.interface";
import { CommunicationCodes } from "../../../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../../../CommonJS/src/messaging/QueueType";

export class EventMarketFilter {
    public id?: number;
    public ids?: number[];
    public event_id?: number;
    public event_ids?: number[];
    public market_id?: number;
    public market_ids?: number[];
    public lang_id: number;
    public include_selections?: boolean;
    public is_tipster: boolean;
    public is_tipster_default: boolean;

    constructor(filter: Partial<EventMarketFilter>) {
        this.id = filter.id;
        this.ids = filter.ids;
        this.event_id = filter.event_id;
        this.event_ids = filter.event_ids;
        this.market_id = filter.market_id;
        this.market_ids = filter.market_ids;
        this.lang_id = filter.lang_id || DEFAULT_LANGUAGE;
        // remove duplicates
        if (this.ids) this.ids = uniq(this.ids);
        if (this.event_ids) this.event_ids = uniq(this.event_ids);
        if (this.market_ids) this.market_ids = uniq(this.market_ids);
        // convert booleans
        this.include_selections = filter.include_selections === undefined ? true : filter.include_selections;
        if (isString(this.include_selections)) this.include_selections = JSON.parse(this.include_selections);
        this.is_tipster = filter.is_tipster === undefined ? false : filter.is_tipster;
        if (isString(this.is_tipster)) this.is_tipster = JSON.parse(this.is_tipster);
        this.is_tipster_default = filter.is_tipster_default === undefined ? false : filter.is_tipster_default;
        if (isString(this.is_tipster_default)) this.is_tipster_default = JSON.parse(this.is_tipster_default);
    }

    public async find(): Promise<IEventMarketPublic[]> {
        const query = QueryBuilder(EventMarket.tableName);
        if (this.id) query.where("id", "=", this.id);
        if (this.ids) query.whereIn("id", this.ids);
        if (this.event_id) query.where("event_id", "=", this.event_id);
        if (this.event_ids && this.event_ids.length > 0) query.whereIn("event_id", this.event_ids);
        if (this.market_id) query.where("market_id", "=", this.market_id);
        if (this.market_ids && this.market_ids.length > 0) query.whereIn("market_ids", this.market_ids);
        // get data from db
        const queryString = query.toString();
        const output = await BaseModel.db.manyOrNone(queryString);
        // wrap db data
        let eventMarkets: IEventMarketPublic[] = await map(output, em => new EventMarketPublic(<IEventMarketPublic>em));
        // include selections is false return
        if (this.include_selections) {
            // if selections included find them
            const selections = await new EventSelectionFilter({
                event_market_id: this.id,
                event_market_ids: this.ids,
                lang_id: this.lang_id
            }).find();
            // group selections
            const selectionsByMarkets = groupBy(selections, "event_market_id");
            // return event markets with selections
            eventMarkets = await map(eventMarkets, async eventMarket => {
                eventMarket.selections = selectionsByMarkets[eventMarket.id];
                return eventMarket;
            })
        }
        // if language id provided select translation for that language
        if (this.lang_id) {
            // get market templates from market service
            const markets: IMarketPublic[] = await broker.sendRequest(CommunicationCodes.GET_MARKETS, {
                ids: eventMarkets.map(em => em.market_id),
                lang_id: this.lang_id,
                is_tipser: this.is_tipster,
                is_tipster_default: this.is_tipster_default
            }, QueueType.MARKET_SERVICE);
            // set event market  properties from market template
            eventMarkets = await map(eventMarkets, async eventMarket => {
                // find market template
                const marketTemplate = markets.find(market => { return market.id == eventMarket.market_id });
                // if not found return eventMarket like it is
                if (!marketTemplate) return eventMarket;
                // if market template was found set properties
                eventMarket.name = marketTemplate.name;
                eventMarket.order_id = marketTemplate.order_id;
                // return event market with properties
                return eventMarket;
            });
        }
        // return event markets
        return eventMarkets;
    }
}