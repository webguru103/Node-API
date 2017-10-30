/**
 * Created by   on 3/5/2017.
 */
import { IEventParticipantDAL } from "./abstract/IEventParticipantDAL";
import { ServiceBase } from "../../../../CommonJS/src/bll/services/ServiceBase";

export class EventParticipantDAL implements IEventParticipantDAL {
    addEventParticipant(eventId: number, participantId: string, mapId: number) {
        let query = `insert into event_participant (event_id, participant_id, map_id)
                      values ($1, $2, $3)
                    on conflict do nothing;`;
        return ServiceBase.db.none(query, [eventId, participantId, mapId]);
    }
}