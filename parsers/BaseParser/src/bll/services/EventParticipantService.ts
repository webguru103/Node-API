/**
 * Created by   on 3/5/2017.
 */
import { IEventParticipantService } from "../abstract/IEventParticipantService";
import { IEventParticipantDAL } from "../../dal/abstract/IEventParticipantDAL";
import { EventParticipantDAL } from "../../dal/EventParticipantDAL";
import { ServiceBase } from "../../../../../CommonJS/src/bll/services/ServiceBase";

export class EventParticipantService extends ServiceBase implements IEventParticipantService {
    private eventParticipantDAL: IEventParticipantDAL = new EventParticipantDAL();

    async addEventParticipant(eventId: number, participantId: string, mapId: number): Promise<any> {
        return this.eventParticipantDAL.addEventParticipant(eventId, participantId, mapId);
    }
}