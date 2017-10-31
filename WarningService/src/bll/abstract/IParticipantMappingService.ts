/**
 * Created by   on 3/27/2017.
 */
export interface IParticipantMappingService {
    addWarning(providerId: number, providerParticipantId: string, providerParticipantName: string, providerSportId: string);
    removeWarning(providerId: number, providerParticipantId: string, providerSportId: string);
    getWarnings(page: number, limit: number);
    getWarningsCount();
}