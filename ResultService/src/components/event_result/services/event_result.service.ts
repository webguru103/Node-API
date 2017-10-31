/**
 * Created by   on 3/1/2017.
 */
import { EventResultFilter } from "../filters/event_selection_result.filter";
import { IEventResult } from "../interfaces/event_result.interface";
import { EventResult } from "../models/event_result.model";
import { broker } from "../../../../../CommonJS/src/base/base.model";
import { ErrorCodes, ErrorUtil } from "../../../../../CommonJS/src/messaging/ErrorCodes";
import { QueueType } from "../../../../../CommonJS/src/messaging/QueueType";
import { CommunicationCodes } from "../../../../../CommonJS/src/messaging/CommunicationCodes";
import { IEventMarketPublic } from "../../../../../EventMarketService/src/components/event.market/interfaces/event.market.interface";
import { map, each } from "bluebird";
import { difference, uniq, isBoolean } from "lodash";
import { SelectionRuleFilter } from "../../selection_rule/filters/selection_rule.filter";
import { EventSelectionResult } from "../../event_selection_result/models/event_selection_result.model";
import { ResultType } from "../../../../../MarketService/src/components/selections/enums/result_type.enum";
import { EventSelectionResultFilter } from "../../event_selection_result/filters/event_selection_result.filter";
import { IEventSelectionResult } from "../../event_selection_result/interfaces/event_selection_result.interface";
import { IScope } from "../../scope/interfaces/scope.interface";
import { IStatisticType } from "../../statistic_type/interfaces/statistic_type.interface";
import { ScopeFilter } from "../../scope/filters/scope.filter";
import { StatisticTypeFilter } from "../../statistic_type/filters/statistic_type.filter";

export class EventResultService {
    async add(data: IEventResult): Promise<IEventSelectionResult[]> {
        // new result
        let newEventResults: IEventResult;
        // 
        const scopesToResult: { [key: number]: number[] } = {};
        // find exising results
        let [eventResult] = await new EventResultFilter({ id: data.id }).find();
        // if results found
        if (eventResult) {
            // old results
            await map(eventResult.results, async oldResult => {
                // find same result in new list
                const updatedResult = data.results.find(nr => nr.scope_id === oldResult.scope_id
                    && nr.statistic_type_id === oldResult.statistic_type_id);
                // if previously this statistic was not resulted for this scope or result removed add it for result calculation
                if (!updatedResult || difference(oldResult.scores, updatedResult.scores).length > 0) {
                    if (!scopesToResult[oldResult.scope_id]) scopesToResult[oldResult.scope_id] = [];
                    scopesToResult[oldResult.scope_id].push(oldResult.statistic_type_id);
                }
            })
            // new results
            await map(data.results, async newResult => {
                // find same result in already existing results
                const oldResult = eventResult.results.find(nr => nr.scope_id === newResult.scope_id
                    && nr.statistic_type_id === newResult.statistic_type_id);
                // if previously this statistic was not resulted for this scope or result this result is new add it for result calculation
                if (!oldResult || difference(oldResult.scores, newResult.scores).length > 0) {
                    if (!scopesToResult[newResult.scope_id]) scopesToResult[newResult.scope_id] = [];
                    scopesToResult[newResult.scope_id].push(newResult.statistic_type_id);
                }
            })
            newEventResults = await eventResult.update(data);
        } else {
            // save results
            newEventResults = await new EventResult(data).saveWithID();
            // take all scopes
            await map(data.results, async newResult => {
                if (!scopesToResult[newResult.scope_id]) scopesToResult[newResult.scope_id] = [];
                scopesToResult[newResult.scope_id].push(newResult.statistic_type_id);
            })
        }
        // get scope ids
        const scopeIds = Object.keys(scopesToResult).map(k => Number(k));
        const allScopes = await new ScopeFilter({ ids: data.results.map(r => r.scope_id) }).find();
        const allStats = await new StatisticTypeFilter({ ids: data.results.map(r => r.statistic_type_id) }).find();
        // result markets
        await map(scopeIds, async key => {
            const statisticTypes = uniq(scopesToResult[key]);
            // result markets by statistic type
            await each(statisticTypes, async statType => this.resultMarketsByStatisticResult(newEventResults.id, key, statType, newEventResults, allScopes, allStats));
        })
        // return results
        const eventSelectionResults = await new EventSelectionResultFilter({ event_id: newEventResults.id }).find();
        // send results to betslip service to result betslip
        broker.sendRequest(CommunicationCodes.UPDATE_EVENT_SELECION_RESULT, eventSelectionResults, QueueType.BETSLIP_SERVICE);
        // return event selection results
        return eventSelectionResults;
    }

    private async resultMarketsByStatisticResult(eventId: number, scopeId: number, statisticTypeId: number, eventResult: IEventResult, scopes: IScope[], statistics: IStatisticType[]): Promise<void> {
        // get event markets
        const eventMarkets: IEventMarketPublic[] = await broker.sendRequest(CommunicationCodes.GET_EVENT_MARKETS, {
            event_id: eventId,
            scope_id: scopeId,
            statistic_type_id: statisticTypeId
        }, QueueType.EVENT_MARKET_SERVICE);
        // result markets
        await map(eventMarkets, async eventMarket => {
            // get market selections rules
            const marketSelectionsRule = await new SelectionRuleFilter({ market_id: eventMarket.market_id }).find();
            // result selections
            return map(eventMarket.selections, async selection => {
                // find selection rule
                const selectionRule = marketSelectionsRule.find(s => s.id === selection.selection_id);
                // if rule not found return
                if (!selectionRule) return;
                // copy rule for edit
                let rule = selectionRule.rule;
                // evaluate rule
                // get expressions
                const expressions = uniq(rule.split('[')
                    .filter(v => v.indexOf(']') > -1)
                    .map(value => value.split(']')[0]))
                // evaluate expressions
                await each(expressions, async exp => {
                    const expResult = await this.evalRuleExpression(exp, scopes, statistics, eventResult);
                    rule = rule.replace(new RegExp(exp, 'g'), expResult);
                })
                // repalce square brackets
                rule = rule.replace(/[\[\]']+/g, '');
                // replace {X} with argument
                if (selection.argument) rule = rule.replace(new RegExp("{X}", "g"), selection.argument)
                // result of expression
                let result: boolean | undefined = undefined;
                // try eval expression
                try { result = eval(rule) } catch (err) {
                    throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST, `Unable to eval rule. Rule:${selectionRule.rule} -> ${rule}`);
                };
                // result should be boolean
                if (!isBoolean(result) || result === undefined) return;
                // selectionr result type
                let selectionResultType: ResultType = ResultType.CANCEL;
                // if result true it is win otherwise lost
                if (result === true) {
                    selectionResultType = ResultType.WIN;
                } else {
                    selectionResultType = ResultType.LOST;
                }
                // if selection result already exists in db find if
                const [selectionResult] = await new EventSelectionResultFilter({ id: selection.id }).find();
                // if result found update result
                if (selectionResult) return selectionResult.update({ result_type_id: selectionResultType });
                // save new result
                return new EventSelectionResult(<any>{
                    id: selection.id,
                    event_id: eventResult.id,
                    event_market_id: eventMarket.id,
                    result_type_id: selectionResultType,
                    selection_id: selection.selection_id
                }).saveWithID();
            })
        })
    }

    private async evalRuleExpression(expression: string, scopes: IScope[], stats: IStatisticType[], eventResult: IEventResult): Promise<string> {
        const objs = expression.split(".");
        // throw error if invalid rule
        if (objs.length < 4)
            throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST, `invalid rule expression:${expression}`);
        let result: string = "";
        // get scope and statistic
        const scope = scopes.find(scope => scope.name === objs[1]);
        const stat = stats.find(stat => stat.name === objs[2]);
        if (!scope || !stat)
            throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST, `scope/statistic not found. scope_name:${objs[1]} stat_name:${objs[2]}`);;
        // find result by scope and statistic id
        const statResult = eventResult.results.find(result => result.scope_id == scope.id && result.statistic_type_id == stat.id);
        if (!statResult)
            throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST, `scope statistic result not found for scope_id:${scope.id} statistic_type_id:${stat.id}`);
        if (!statResult.scores || statResult.scores.length == 0)
            throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST, `scores for scope statistic result not found for scope_id:${scope.id} statistic_type_id:${stat.id}`);
        // if result found and scores exist
        const participantType = objs[0];
        // 
        switch (objs[3]) {
            case "count":
                if (participantType === "home_team") result = statResult.scores[0].score.toString();
                if (participantType === "away_team") result = statResult.scores[1].score.toString();
                break;
        }
        return result;
    }

    async get(filter: Partial<EventResultFilter>): Promise<IEventResult> {
        const [result] = await this.list(filter);
        return result;
    }

    async list(filter: Partial<EventResultFilter>): Promise<IEventResult[]> {
        return new EventResultFilter(filter).find();
    }

    async update(data: IEventResult): Promise<IEventResult | undefined> {
        // find result
        const result = <EventResult | undefined>await EventResult.findOne(<any>EventResult, { id: data.id })
        // if result not found return
        if (!result) return undefined;
        // update result
        return result.update(data);
    }

    async delete(data: IEventResult): Promise<any> {
        return EventResult.delete(<any>EventResult, data);
    }
}