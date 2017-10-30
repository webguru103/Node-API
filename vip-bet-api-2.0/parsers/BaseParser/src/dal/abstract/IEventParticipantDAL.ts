/**
 * Created by   on 3/5/2017.
 */
export interface IEventParticipantDAL {
    addEventParticipant(eventId: number, participantId: string, mapId: number);
}