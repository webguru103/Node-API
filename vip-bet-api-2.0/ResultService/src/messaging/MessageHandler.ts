/**
 * Created by   on 3/1/2017.
 */

import { MessageHandlerBase } from "../../../CommonJS/src/messaging/MessageHandlerBase";
import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { EventSelectionResultService } from "../components/event_selection_result/services/event_selection_result.service";
import { EventResultService } from "../components/event_result/services/event_result.service";
import { StatisticTypeService } from "../components/statistic_type/services/statistic_type.service";
import { ScopeService } from "../components/scope/services/scope.service";
import { SelectionRuleService } from "../components/selection_rule/services/selection_rule.service";

const eventSelectionResultService = new EventSelectionResultService();
const eventResultService = new EventResultService();
const statisticTypeService = new StatisticTypeService();
const scopeService = new ScopeService();
const ruleService = new SelectionRuleService();
export class MessageHandler extends MessageHandlerBase {
    protected async handleMessage(message: any): Promise<any> {
        const body = message.body;
        switch (message.code) {
            // event selections
            case CommunicationCodes.RESULT_EVENT_SELECTIONS:
                return eventSelectionResultService.add(body);
            case CommunicationCodes.GET_EVENT_SELECTION_RESULTS:
                return eventSelectionResultService.list(body);
            case CommunicationCodes.UPDATE_EVENT_SELECION_RESULT:
                return eventSelectionResultService.update(body);
            case CommunicationCodes.UPDATE_EVENT_SELECION_RESULTS:
                return eventSelectionResultService.updateMany(body);
            // event results
            case CommunicationCodes.RESULT_EVENT:
                return eventResultService.add(body);
            case CommunicationCodes.GET_EVENT_RESULT:
                return eventResultService.get(body);
            case CommunicationCodes.GET_EVENTS_RESULTS:
                return eventResultService.list(body);
            case CommunicationCodes.UPDATE_EVENT_RESULT:
                return eventResultService.update(body);
            case CommunicationCodes.UPDATE_EVENTS_RESULTS:
                return eventResultService.update(body);
            case CommunicationCodes.DELETE_EVENT_RESULT:
                return eventResultService.delete(body);
            // scopes
            case CommunicationCodes.ADD_SCOPE:
                return scopeService.add(body);
            case CommunicationCodes.GET_SCOPES:
                return scopeService.list(body);
            case CommunicationCodes.UPDATE_SCOPE:
                return scopeService.update(body);
            case CommunicationCodes.UPDATE_SCOPES:
                return scopeService.updateMany(body);
            case CommunicationCodes.DELETE_SCOPE:
                return scopeService.delete(body);
            // stats
            case CommunicationCodes.ADD_STATISTIC_TYPE:
                return statisticTypeService.add(body);
            case CommunicationCodes.GET_STATISTIC_TYPES:
                return statisticTypeService.list(body);
            case CommunicationCodes.UPDATE_STATISTIC_TYPE:
                return statisticTypeService.update(body);
            case CommunicationCodes.UPDATE_STATISTIC_TYPES:
                return statisticTypeService.updateMany(body);
            case CommunicationCodes.DELETE_STATISTIC_TYPE:
                return statisticTypeService.delete(body);
            case CommunicationCodes.ADD_RULES:
                return ruleService.addMany(body);
            case CommunicationCodes.GET_RULES:
                return ruleService.list(body);
            case CommunicationCodes.DELETE_RULES:
                return ruleService.delete(body);
        }
    }
}