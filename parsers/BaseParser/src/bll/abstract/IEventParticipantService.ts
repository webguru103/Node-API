/**
 * Created by   on 3/5/2017.
 */
export interface IEventParticipantService {
    addEventParticipant(eventId: number, participantId: string, mapId: number);
}