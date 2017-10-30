import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { EventService } from "../../../BaseParser/src/bll/services/EventService";
import { IEventService } from "../../../BaseParser/src/bll/abstract/IEventService";
import { map } from "bluebird";
import { isArray } from "lodash";
import { ResultType } from "../../../../MarketService/src/components/selections/enums/result_type.enum";
import { IEventSelectionMapping } from "../../../../MappingService/src/components/event_selection/interfaces/event_selection.mapping.interface";
import { broker } from "../../../../CommonJS/src/base/base.model";
import { QueueType } from "../../../../CommonJS/src/messaging/QueueType";
import { CommunicationCodes } from "../../../../CommonJS/src/messaging/CommunicationCodes";
import { ProviderID } from "../../../BaseParser/src/ProviderID";
import { EventType } from "../../../../EventService/src/components/events/enums/event_type.enum";
import { Ladbrokes } from "../utils/ladbrokes";
import { IEventSelectionResult } from "../../../../ResultService/src/components/event_selection_result/interfaces/event_selection_result.interface";
import { IEventSelection } from "../../../../EventMarketService/src/components/event.selection/interfaces/event.selection.interface";

export class ResultParser extends ParserBase {
    private eventService: IEventService = new EventService();
    async processRequest(data) {
        // date from
        const dateFrom: Date = new Date();
        // take last two week events
        dateFrom.setDate(dateFrom.getDate() - 14);
        // date to now
        const dateTo: Date = new Date();
        // get events
        const events = await this.eventService.getEvents(EventType.PRE_MATCH, dateFrom, dateTo);
        // get event results
        await map(events, async event => {
            // if parser stopped return
            if (ParserBase.stopped) return;
            // get results
            const results = await Ladbrokes.GetEventResult(event.id);
            // if response does not contains results return
            if (!results || !results.event || !results.event.markets) return;
            // get markets
            const markets = isArray(results.event.markets.market) ? results.event.markets.market : [results.event.markets.market];
            const selectionsResults: { [key: number]: ResultType } = {};
            //saving selections results
            await map(markets, async market => {
                const selections = isArray(market.selections.selection) ? market.selections.selection : [market.selections.selection];
                await map(selections, async (selection: any) => {
                    if (selection === undefined || selection.result === undefined) return;
                    selectionsResults[selection.selectionKey] = this.getPredictionResult(selection.result.resultCode);
                });
            });
            // get system selection ids
            const selectionsMappings: IEventSelectionMapping[] = await broker.sendRequest(CommunicationCodes.GET_EVENT_SELECTIONS_BY_PROVIDER_ID_AND_PROVIDER_SELECTION_ID, {
                provider_id: ProviderID.LAD_BROKES, selections: Object.keys(selectionsResults)
            }, QueueType.MAPPING_SERVICE);
            // const get event selections
            const eventSelections: IEventSelection[] = await broker.sendRequest(CommunicationCodes.GET_EVENT_SELECTIONS, {
                event_selections: selectionsMappings.map(s => s.system_event_selection_id)
            }, QueueType.EVENT_MARKET_SERVICE);
            // if system selection empty return
            if (selectionsMappings.length === 0 || eventSelections.length === 0) return;
            // create system selection id and result pair
            const selectionResults: { [key: number]: IEventSelectionResult } = await map(selectionsMappings, async selectionMap => {
                const systemSelection = <IEventSelection>eventSelections.find(es => es.id === selectionMap.system_event_selection_id);
                return <IEventSelectionResult>{
                    id: selectionMap.system_event_selection_id,
                    event_id: systemSelection.event_id,
                    event_market_id: systemSelection.event_market_id,
                    selection_id: systemSelection.selection_id,
                    result_type_id: selectionsResults[selectionMap.provider_event_selection_id]
                }
            })
            // send results to update bets
            broker.sendRequest(CommunicationCodes.UPDATE_EVENT_SELECION_RESULT, selectionResults, QueueType.BETSLIP_SERVICE);
            broker.sendRequest(CommunicationCodes.UPDATE_EVENT_SELECION_RESULT, selectionResults, QueueType.MARKET_SERVICE);
            broker.sendRequest(CommunicationCodes.UPDATE_EVENT_SELECION_RESULTS, selectionResults, QueueType.RESULT_SERVICE);
        })
    }

    private getPredictionResult(result: string): ResultType {
        switch (result) {
            case "Lose":
                return ResultType.LOST;
            case "Win":
                return ResultType.WIN;
            case "Void":
                return ResultType.CANCEL;
            default:
                return ResultType.LOST;
        }
    }
}