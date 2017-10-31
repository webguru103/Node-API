/**
 * Created by   on 3/5/2017.
 */

import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventService } from "../../../BaseParser/src/bll/abstract/IEventService";
import { EventService } from "../../../BaseParser/src/bll/services/EventService";
import { map } from "bluebird";
import { isArray } from "lodash";
import { IFeedParticipant } from "../../../BaseParser/src/interfaces/IFeedParticipant";
import { EventType } from "../../../../EventService/src/components/events/enums/event_type.enum";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";
import { IEvent } from "../intertops";

export class EventParser extends ParserBase {
    private eventService: IEventService = new EventService();

    async processRequest(event: IEvent) {
        // collect event details
        const id = event.$.id;
        const name = event.$.n;
        const sportId = event.sportId;
        const countryId = event.countryId;
        const leagueId = event.leagueId;
        const startDate = new Date(event.$.dt + "Z");
        // parse participants
        const participants = this.parseParticipants(event);
        if (participants.length < 2) return;
        // add event to db
        await this.eventService.addEvent(id, name, EventType.PRE_MATCH, startDate, EventStatus.ACTIVE, sportId, countryId, leagueId, participants);
        // get event markets
        const markets = event.t;
        // if no bets found
        if (!isArray(markets)) return;
        // process markets
        return map(markets, async market => {
            // sort market in order to keep them by versions
            if (ParserBase.stopped) return;
            market.sportId = sportId;
            market.countryId = countryId;
            market.leagueId = leagueId;
            market.eventId = id;
            market.participants = participants;
            return this.successor.processRequest(market).catch(err => {
                console.log("EventMarketParser Error: ");
                console.log(err);
            });
        }, { concurrency: 5 });
    }

    private parseParticipants(event: IEvent): IFeedParticipant[] {
        const returnParticipants: IFeedParticipant[] = [];
        // home participant
        let parts: string[] = event.$.n.split(" v ");
        if (parts.length < 2) parts = event.$.n.split(" @ ").reverse();
        // if parts counts less then two return;
        if (parts.length < 2) return returnParticipants;
        returnParticipants.push({
            id: parts[0],
            name: parts[0],
            type: "Home"
        })
        // away participant
        returnParticipants.push({
            id: parts[1],
            name: parts[1],
            type: "Away"
        })
        return returnParticipants;
    }
}