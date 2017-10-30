/**
 * Created by   on 3/5/2017.
 */

import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventService } from "../../../BaseParser/src/bll/abstract/IEventService";
import { EventService } from "../../../BaseParser/src/bll/services/EventService";
import { map } from "bluebird";
import { isArray } from "lodash";
import { EventType } from "../../../../EventService/src/components/events/enums/event_type.enum";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";
import { Ladbrokes, IEvent } from "../utils/ladbrokes";
import { IFeedParticipant } from "../../../BaseParser/src/interfaces/IFeedParticipant";

export class EventParser extends ParserBase {
    private eventService: IEventService = new EventService();

    async processRequest(data: IEvent) {
        const sportId = data.classKey.toString();
        const countryId = data.typeKey.toString();
        const leagueId = data.subTypeKey.toString();
        const eventId = data.eventKey.toString();
        const eventWithSelection = await Ladbrokes.GetEventWithSelections(data.eventKey);
        const event = eventWithSelection.event;
        const participants = this.getEventParticipants(event.eventName);
        if (participants.length < 2) return;
        const startDate = new Date(event.eventDateTime);
        // add event
        await this.eventService.addEvent(eventId, event.eventName, EventType.PRE_MATCH, startDate, EventStatus.ACTIVE, sportId, countryId, leagueId, participants);
        // if markets missing return
        if (!event.markets || !event.markets.market) return;
        // markets
        const markets = isArray(event.markets.market) ? event.markets.market : [event.markets.market];
        // process markets
        return map(markets, async market => {
            if (ParserBase.stopped) return;
            market.classKey = data.classKey;
            market.typeKey = data.typeKey;
            market.subTypeKey = data.subTypeKey;
            market.eventKey = data.eventKey;
            market.participants = participants;
            return this.successor.processRequest(market).catch(err => {
                console.log("EventMarketParser Error: " + err);
            });
        }, { concurrency: 5 });
    }

    private getEventParticipants(eventName: string): IFeedParticipant[] {
        if (!eventName) return [];
        let participants: string[] = [];
        if (eventName.indexOf(" v ") != -1) participants = eventName.split(" v ");
        else if (eventName.indexOf(" V ") != -1) participants = eventName.split(" V ");
        else if (eventName.indexOf(" vs ") != -1) participants = eventName.split(" vs ");
        else if (eventName.indexOf(" VS ") != -1) participants = eventName.split(" VS ");
        else if (eventName.indexOf(" at ") != -1) participants = eventName.split(" at ").reverse();
        else if (eventName.indexOf(" At ") != -1) participants = eventName.split(" At ").reverse();
        else if (eventName.indexOf(" AT ") != -1) participants = eventName.split(" AT ").reverse();
        else if (eventName.indexOf(" @ ") != -1) participants = eventName.split(" @ ").reverse();
        else if (eventName.indexOf(" / ") != -1) {
            participants = eventName.split(" / ");
        }
        // return if count is not 2
        if (participants.length != 2) return [];
        // return participants
        return [{
            id: participants[0].trim(),
            name: participants[0].trim(),
            type: "Home"
        }, {
            id: participants[1].trim(),
            name: participants[1].trim(),
            type: "Away"
        }];
    }
}