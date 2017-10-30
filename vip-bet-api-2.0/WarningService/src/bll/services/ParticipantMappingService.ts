/**
 * Created by   on 3/27/2017.
 */
import { IParticipantMappingService } from "../abstract/IParticipantMappingService";
import { IParticipantMappingDAL } from "../../dal/abstract/IParticipantMappingDAL";
import { ParticipantMappingDAL } from "../../dal/ParticipantMappingDAL";
import { CommunicationCodes } from "../../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../../CommonJS/src/messaging/QueueType";
import { broker } from "../../../../CommonJS/src/bll/services/ServiceBase";

export class ParticipantMappingService implements IParticipantMappingService {
    private participantMappingDAL: IParticipantMappingDAL = new ParticipantMappingDAL();

    async addWarning(providerId: number, providerParticipantId: string, providerParticipantName: string, providerSportId: string) {
        let mapping = await broker.sendRequest(CommunicationCodes.GET_CATEGORY_MAPPING, {
            provider_id: providerId,
            provider_category_id: providerSportId
        }, QueueType.MAPPING_SERVICE);

        if (!mapping) return;
        return this.participantMappingDAL.addWarning(providerId, providerParticipantId, providerParticipantName, providerSportId, mapping.provider_category_name);
    }

    async removeWarning(providerId: number, providerParticipantId: string, providerSportId: string) {
        return this.participantMappingDAL.removeWarning(providerId, providerParticipantId, providerSportId);
    }

    async getWarnings(page: number, limit: number) {
        return this.participantMappingDAL.getWarnings(page, limit);
    }

    async getWarningsCount() {
        return this.participantMappingDAL.getWarningsCount();
    }
}