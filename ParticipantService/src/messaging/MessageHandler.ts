/**
 * Created by   on 3/1/2017.
 */

import { CommunicationCodes } from "../../../CommonJS/src/messaging/CommunicationCodes";
import { MessageHandlerBase } from "../../../CommonJS/src/messaging/MessageHandlerBase";
import { ParticipantService } from "../components/participants/services/participant.service";
import { ParticipantLeagueService } from "../components/participant_leagues/services/participant_league.service";

const participantService = new ParticipantService();
const participantLeagueService = new ParticipantLeagueService();

export class MessageHandler extends MessageHandlerBase {
    protected async handleMessage(message: any): Promise<any> {
        const body = message.body;
        switch (message.code) {
            case CommunicationCodes.ADD_PARTICIPANT:
                return participantService.add(body);
            case CommunicationCodes.GET_PARTICIPANT:
                return participantService.get(body);
            case CommunicationCodes.DELETE_PARTICIPANT:
                return participantService.delete(body.id, body.merge_id);
            case CommunicationCodes.UPDATE_PARTICIPANT:
                return participantService.update(body);
            case CommunicationCodes.UPDATE_PARTICIPANT_LEAGUES:
                return participantLeagueService.update(body.id, body.leagues);
            case CommunicationCodes.GET_PARTICIPANT_LEAGUES:
                return participantLeagueService.get(body);
            case CommunicationCodes.ADD_PARTICIPANT_TO_LEAGUE:
                return participantLeagueService.add(body);
            case CommunicationCodes.SEARCH_PARTICIPANT:
                return participantService.list(body);
        }
    }
}