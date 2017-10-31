/**
 * Created by   on 3/9/2017.
 */
import { QueueType } from "../../../../../CommonJS/src/messaging/QueueType";
import { Participant } from "../models/participant.model";
import { CommunicationCodes } from "../../../../../CommonJS/src/messaging/CommunicationCodes";
import { broker } from "../../../../../CommonJS/src/base/base.model";
import { ErrorUtil } from "../../../../../CommonJS/src/messaging/ErrorCodes";
import { ParticipantFilter } from "../filters/participant.filter";
import { IParticipant } from "../interfaces/participant.interface";
import { DEFAULT_LANGUAGE } from "../../../../../CommonJS/src/domain/constant";
import { isNotNumber } from "../../../../../CommonJS/src/utils/validators";

export class ParticipantService {
    async add(data: Participant): Promise<IParticipant> {
        const [participant] = await this.list({ name: data.name, sport_id: data.sport_id })
        if (participant) return participant;
        return new Participant(data).saveWithID();
    }

    async delete(id: number, merge_id?: number): Promise<void> {
        if (isNotNumber(id)) throw ErrorUtil.newError("participant id is not provided");
        // find participant
        const participant = await this.get({ id: id });
        if (!participant) return;
        // delete participant
        await participant.delete({ id: participant.id });
        // unmap participant
        await broker.sendRequest(
            CommunicationCodes.UN_MAP_PARTICIPANT_FOR_ALL_PROVIDERS, {
                system_participant_id: id
            },
            QueueType.MAPPING_SERVICE);
    }

    async get(filter: Partial<ParticipantFilter>): Promise<IParticipant | undefined> {
        if (isNotNumber(filter.id)) throw ErrorUtil.newError("participant id is not provided");
        const [participant] = await this.list(filter);
        if (!participant) return;
        return participant;
    }

    async getParticipantsBySportId(sportId: number, langId: number = DEFAULT_LANGUAGE) {
        if (isNotNumber(sportId)) throw ErrorUtil.newError("sport_id is not provided");
        return Participant.getParticipantsBySportId(sportId, langId);
    }

    async update(data: Participant): Promise<IParticipant | undefined> {
        if (isNotNumber(data.id)) throw ErrorUtil.newError("participant id is not provided");
        const participant = await Participant.findOne({ id: data.id });
        if (!participant) return;
        return participant.update(data);
    }

    async list(data: Partial<ParticipantFilter>): Promise<IParticipant[]> {
        return new ParticipantFilter(data).find();
    }
}