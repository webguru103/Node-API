/**
 * Created by   on 3/5/2017.
 */

import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventService } from "../../../BaseParser/src/bll/abstract/IEventService";
import { EventService } from "../../../BaseParser/src/bll/services/EventService";
import { each } from "bluebird";
import { EventType } from "../../../../EventService/src/components/events/enums/event_type.enum";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";
import { IRKEvent, IRKParticipant } from "../utils/redkings";
import { IFeedParticipant } from "../../../BaseParser/src/interfaces/IFeedParticipant";

export class EventParser extends ParserBase {
    private eventService: IEventService = new EventService();
    async processRequest(data: IRKEvent) {
        const id: string = data.$.id;
        const name: string = data.$.name;
        const sportId: string = data.SportId;
        const countryId: string = data.CountryId;
        const leagueId: string = data.LeagueId;
        const startDate: Date = new Date(data.StartDate[0]['_'] + " +00");
        const markets = data.MatchOdds[0].BettingOffer;
        const participants: any[] = this.parseParticipants(data.Participants[0].Participant);
        // add event
        await this.eventService.addEvent(id, name, EventType.PRE_MATCH, startDate, EventStatus.ACTIVE, sportId, countryId, leagueId, participants);
        // process markets
        return each(markets, async market => {
            if (ParserBase.stopped) return;
            market.SportId = sportId;
            market.CountryId = countryId;
            market.LeagueId = leagueId;
            market.EventId = id;
            market.Participants = participants;
            return this.successor.processRequest(market).catch(err => {
                console.log("EventMarketParser Error: ");
                console.log(err);
            });
        });
    }

    private parseParticipants(participants: IRKParticipant[]): IFeedParticipant[] {
        let returnParticipants: any[] = [];
        participants.forEach(participant => {
            returnParticipants.push({
                id: participant.$.id,
                name: participant.$.name,
                type: participant.$.type
            })
        });
        return returnParticipants;
    }
}