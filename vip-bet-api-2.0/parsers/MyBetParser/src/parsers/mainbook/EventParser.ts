/**
 * Created by   on 3/5/2017.
 */

import { ParserBase } from "../../../../BaseParser/src/ParserBase";
import { IEventService } from "../../../../BaseParser/src/bll/abstract/IEventService";
import { EventService } from "../../../../BaseParser/src/bll/services/EventService";
import { TranslationUtil } from "../../utils/TranslationUtil";
import { LanguageType } from "../../utils/LanguageType";
import { each, map } from "bluebird";
import { EventType } from "../../../../../EventService/src/components/events/enums/event_type.enum";
import { EventStatus } from "../../../../../EventService/src/components/events/enums/event_status.enum";

export class EventParser extends ParserBase {
    private eventService: IEventService = new EventService();

    async processRequest(data) {
        let events: any[] = data.events;
        if (!events) return;

        return each(events, async event => {
            const id: string = event['$'].id;
            const name: string = event['$'].name;
            const sportId: string = data.sportId;
            const countryId: string = data.countryId;
            const leagueId: string = data.leagueId;
            const startDate: Date = new Date(event['$']['start-date']);
            const markets: any[] = event.market;
            const status = this.getEventStatus(event['$'].state);
            if (!markets) return;

            const participants = await this.parseParticipants(event.participant);
            if (participants.length != 2) return;

            await this.eventService.addEvent(id, name, EventType.PRE_MATCH, startDate, status, sportId, countryId, leagueId, participants);

            return map(markets, async market => {
                if (ParserBase.stopped) return;
                market['sportId'] = sportId;
                market['countryId'] = countryId;
                market['leagueId'] = leagueId;
                market['eventId'] = id;
                market['participants'] = participants;
                return this.successor.processRequest(market).catch(err => {
                    console.log("EventMarketParser Error: ");
                    console.log(err);
                });
            }, { concurrency: 5 });
        });
    }

    private getEventStatus(providerStatus: string) {
        switch (providerStatus) {
            case "open":
                return EventStatus.ACTIVE;
            case "paused":
                return EventStatus.SUSPENDED;
        }
        return EventStatus.ACTIVE;
    }

    private async parseParticipants(participants: any[]) {
        let participantsToReturn: any[] = [];
        await map(participants, participant => {
            let name = TranslationUtil.getTranslation(participant['$']['translation-id'], LanguageType.en);
            if (!name) return;
            participantsToReturn.push({
                id: name,
                name: name,
                type: participant['$'].type
            })
        });
        return participantsToReturn;
    }
}