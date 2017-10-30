import { IMarket, IMarketPublic } from "../interfaces/market.interface";
import { Market, MarketPublic } from "../models/market.model";
import { Translate } from "../../../../../CommonJS/src/components/translates/models/translate.model";
import { each, map, all } from "bluebird";
import { SelectionModel } from "../../selections/models/selection.model";
import { DEFAULT_LANGUAGE } from "../../../../../CommonJS/src/domain/constant";
import { MarketFilter } from "../filters/market.filter";
import { ErrorUtil, ErrorCodes } from "../../../../../CommonJS/src/messaging/ErrorCodes";
import { forEach } from "lodash";
import { ISelectionModel } from "../../selections/interfaces/selection.interface";
import { SelectionService } from "../../selections/services/selection.service";
import { broker } from "../../../../../CommonJS/src/base/base.model";
import { CommunicationCodes } from "../../../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../../../CommonJS/src/messaging/QueueType";
import { NOT_FOUND } from "http-status-codes";

export class MarketService {
    private selectionService = new SelectionService();
    async add(data: IMarketPublic): Promise<IMarketPublic> {
        let market = await Market.findOne(<any>Market, { name: data.name, category_id: data.category_id });
        if (market) return market;
        // if lanugage missing set default language
        if (data.lang_id === undefined) data.lang_id = DEFAULT_LANGUAGE;
        // save translation
        const translate = new Translate({ lang_id: data.lang_id, translation: data.name });
        await translate.saveWithID();
        // wrap market
        market = new Market(data);
        // set generated dict_id
        market.dict_id = translate.dict_id;
        // save market
        await market.saveWithID(`on conflict (category_id, name) do update set name = '${data.name}'`);
        // save selections
        const publicMarket = new MarketPublic(data);
        publicMarket.id = market.id;
        if (data.selections !== undefined) {
            publicMarket.selections = await map(data.selections, async selection => {
                selection.lang_id = data.lang_id;
                selection.market_id = market.id;
                return this.selectionService.add(selection);
            });
        }
        // return market
        return publicMarket;
    }

    async get(filter: Partial<MarketFilter>): Promise<IMarketPublic> {
        // create market filter instance
        const marketFilter = new MarketFilter({ id: filter.id });
        // find market
        const [market] = await marketFilter.find();
        // return market
        return market;
    }

    async delete(data: IMarketPublic): Promise<void> {
        // find market
        const market = await this.get({ id: data.id });
        if (!market) throw ErrorUtil.newError(NOT_FOUND, "market not found");
        //delete event markets
        await broker.sendRequest(CommunicationCodes.DELETE_EVENT_MARKET_BY_MARKET_ID_CASCADE,
            { system_market_id: data.id, unmap: false }, QueueType.EVENT_MARKET_SERVICE);
        //unmap market
        await broker.sendRequest(CommunicationCodes.UN_MAP_EVENT_MARKET_CASCADE_BY_MARKET_ID,
            { system_market_id: data.id, unmap_template: true }, QueueType.MAPPING_SERVICE);
        // delete rules
        await broker.sendRequest(CommunicationCodes.DELETE_RULES, { market_id: data.id }, QueueType.RESULT_SERVICE);
        // delete market
        // delete selections
        await map(market.selections, selection => {
            return this.selectionService.delete(selection);
        });
        // delete market
        await new Market(market).delete();
    }

    async update(data: IMarketPublic): Promise<any> {
        if (data.selections) data.selections.map(s => s.lang_id = data.lang_id);
        // find market
        const market = await this.get({ id: data.id });
        // if market not found return error
        if (!market) throw ErrorUtil.newError(ErrorCodes.NOT_FOUND);
        // update translation
        if (data.name !== market.name) await Translate.update(<any>Translate, { translation: data.name }, { lang_id: data.lang_id, dict_id: market.dict_id }, );
        // update market
        await new Market(data).update();
        // if selections was not provided dont update them
        if (data.selections === undefined) return;
        // update selections

        //delete old selections
        await each(market.selections, async oldSelection => {
            let deleteSelection: boolean = true;
            forEach(data.selections, selection => {
                if (oldSelection.id === selection.id) {
                    deleteSelection = false;
                    return false;
                }
            });
            if (deleteSelection) {
                return this.selectionService.delete(oldSelection);
            }
        })
        //add/update selections
        await each(data.selections, selection => {
            if (!selection.id) {
                selection.market_id = market.id;
                return this.selectionService.add(selection);
            } else {
                return this.selectionService.update(selection);
            }
        });
    }

    async list(filter: MarketFilter): Promise<IMarketPublic[]> {
        // create filter
        const marketFilter = new MarketFilter(filter);
        // find markets
        return marketFilter.find();
    }

    async updateMany(markets: IMarket[]): Promise<IMarket[]> {
        return map(markets, market => {
            return new Market(market).update();
        });
    }
}