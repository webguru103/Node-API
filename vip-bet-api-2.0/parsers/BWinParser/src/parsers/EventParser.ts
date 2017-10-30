/**
 * Created by   on 3/5/2017.
 */

import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventService } from "../../../BaseParser/src/bll/abstract/IEventService";
import { EventService } from "../../../BaseParser/src/bll/services/EventService";
import { EventType } from "../../../../CommonJS/src/domain/enums/event.type";
import { EventStatus } from "../../../../CommonJS/src/domain/enums/event.status";
import { map } from "bluebird";
import { IFeedParticipant } from "../../../BaseParser/src/interfaces/IFeedParticipant";
import { IBetFairEvent, Bwin } from "../utils/bwin";
import { isArray } from "lodash";

export class EventParser extends ParserBase {
    private eventService: IEventService = new EventService();

    async processRequest(event: IBetFairEvent) {
        // reject live events;
        if (JSON.parse(event.in_play)) return;
        // event markets
        const markets = await Bwin.getEventMarkets(event.bf_event_id);
        // check if responce is array and not empty
        if (!isArray(markets) || markets.length == 0 || markets.every(m => m.status !== "OPEN")) return;
        // collect event details
        const id: string = event.bf_event_id;
        const name: string = event.event_name;
        const sportId = event.bf_sport_id
        const countryId = event.bf_country_id;
        const leagueId = event.bf_league_id;
        // event start date
        const startDate: Date = new Date(event.start_time.$date);
        // parse participants
        const participants = this.parseParticipants(event);
        if (participants.length !== 2) return;
        // add event to db
        await this.eventService.addEvent(id, name, EventType.PRE_MATCH, startDate, EventStatus.ACTIVE, sportId, countryId, leagueId, participants);
        // process markets
        return map(markets, async market => {
            // if parser stopped return
            if (ParserBase.stopped) return;
            // set market details
            market.bf_sport_id = sportId;
            market.bf_event_id = id;
            market.participants = participants;
            // process market
            return this.successor.processRequest(market).catch(err => {
                console.log("EventMarketParser Error: ");
                console.log(err);
            });
        });
    }

    private parseParticipants(event: IBetFairEvent): IFeedParticipant[] {
        const returnParticipants: any[] = [];
        const names = event.event_name.split(" v ");
        if (names.length !== 2) return returnParticipants;
        // home participant
        returnParticipants.push({
            id: names[0],
            name: names[0],
            type: "Home"
        })
        // away participant
        returnParticipants.push({
            id: names[1],
            name: names[1],
            type: "Away"
        })
        return returnParticipants;
    }
}