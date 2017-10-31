/**
 * Created by   on 3/1/2017.
 */

import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { MessageHandlerBase } from "../../../CommonJS/src/messaging/MessageHandlerBase";
import { BetSlipService } from "../components/betslip/services/betslip.service";
import { BetSlipDetailService } from "../components/betslipdetail/services/betslipdetail.service";
import { StatisticService } from "../components/statistics/services/statistic.service";

const betSlipService = new BetSlipService();
const betSlipDetailService = new BetSlipDetailService();
const statisticsService = new StatisticService();

export class MessageHandler extends MessageHandlerBase {
    protected async handleMessage(message: any): Promise<any> {
        const body = message.body;
        switch (message.code) {
            case CommunicationCodes.PLACE_BET:
                return betSlipService.add(body);
            case CommunicationCodes.GET_BET_SLIP:
                return betSlipService.get(body);
            case CommunicationCodes.GET_BET_SLIPS:
                return betSlipService.list(body);
            case CommunicationCodes.UPDATE_BET_SLIP:
                return betSlipService.update(body);
            case CommunicationCodes.GET_BET_SLIP_DETAIL:
                return betSlipDetailService.get(body.id);
            case CommunicationCodes.GET_BET_SLIP_DETAILS:
                return betSlipDetailService.list(body);
            case CommunicationCodes.UPDATE_BET_SLIP_DETAIL:
                return betSlipDetailService.update(body);
            case CommunicationCodes.GET_USER_BETTING_STATISTICS:
                return statisticsService.getсUserBettingStatistic(body);
            case CommunicationCodes.GET_LEADERBOARD:
                return statisticsService.getLeaderboard(body);
            case CommunicationCodes.GET_USER_TIPSTER_OBJECTS:
                return statisticsService.getUserTipsterObjects(body);
            case CommunicationCodes.UPDATE_EVENT_SELECION_RESULT:
                return betSlipDetailService.updateResult(body);
        }
    }
}