/**
 * Created by   on 3/9/2017.
 */
import { QueueType } from "../../../../../CommonJS/src/messaging/QueueType";
import { map } from "bluebird";
import { isArray } from "lodash";
import { CommunicationCodes } from "../../../../../CommonJS/src/messaging/CommunicationCodes";
import { broker } from "../../../../../CommonJS/src/base/base.model";
import { isNotNumber } from "../../../../../CommonJS/src/utils/validators";
import { DEFAULT_LANGUAGE } from "../../../../../CommonJS/src/domain/constant";
import { ParticipantLeague } from "../models/participant_league.model";
import { ICategory } from "../../../../../CategoryService/src/components/category/interfaces/category.interface";
import { IParticipantLeague } from "../interfaces/participant_league.interface";
import { ErrorUtil } from "../../../../../CommonJS/src/messaging/ErrorCodes";
import { IParticipant } from "../../participants/interfaces/participant.interface";

export class ParticipantLeagueService {
    async get(participant: IParticipant) {
        if (isNotNumber(participant.id)) throw ErrorUtil.newError("participant is not provided");
        const participantLeagues: any[] = await ParticipantLeague.findMany(<any>ParticipantLeague, { participant_id: participant.id }, undefined, undefined, undefined, undefined, undefined, "participant_id");
        return map(participantLeagues, async league => {
            let category = await this.getCategory(league.country_id, participant.lang_id || DEFAULT_LANGUAGE);
            if (!category) return;
            league.country = {
                id: league.country_id,
                name: category.name
            };

            category = await this.getCategory(league.league_id, participant.lang_id || DEFAULT_LANGUAGE);
            league.league = {
                id: league.league_id,
                name: category.name
            };
            return {
                league: league.league,
                country: league.country
            };
        })
    }

    async update(participantId: number, leagues: IParticipantLeague[]) {
        if (!isArray(leagues)) throw ErrorUtil.newError("leagues is not array");
        // 
        await map(leagues, async league => {
            if (!league.country_id || !league.league_id) throw ErrorUtil.newError("country_id/league_id is missing");
        })
        if (isNotNumber(participantId)) throw ErrorUtil.newError("participant_id is not provided");

        await ParticipantLeague.delete(<any>ParticipantLeague, { participant_id: participantId });
        // add participant leagues
        return map(leagues, async league => {
            return this.add(<IParticipantLeague>{ participant_id: participantId, league_id: league.league_id, country_id: league.country_id });
        })
    }

    async add(data: IParticipantLeague) {
        return new ParticipantLeague(data).save(" on conflict(league_id,participant_id) do update set league_id=" + data.league_id);
    }

    private async getCategory(categoryId: number, langId: number = DEFAULT_LANGUAGE): Promise<ICategory> {
        return broker.sendRequest(CommunicationCodes.GET_CATEGORY, {
            id: categoryId,
            lang_id: langId
        }, QueueType.CATEGORY_SERVICE)
    }
}