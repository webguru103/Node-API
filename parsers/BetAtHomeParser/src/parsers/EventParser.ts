/**
 * Created by   on 3/5/2017.
 */

import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventService } from "../../../BaseParser/src/bll/abstract/IEventService";
import { EventService } from "../../../BaseParser/src/bll/services/EventService";
import { IFeedParticipant } from "../../../BaseParser/src/interfaces/IFeedParticipant";
import { map } from "bluebird";
import { EventType } from "../../../../EventService/src/components/events/enums/event_type.enum";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";
import { IBetAtHomeSportEvent } from "../betAtHome";

export class EventParser extends ParserBase {
    private eventService: IEventService = new EventService();
    // precess data
    async processRequest(event: IBetAtHomeSportEvent) {
        // event markets
        const markets = event.Bet;
        // if there is no markets
        if (!markets || markets.length === 0) return;
        // if event does not have home team return
        if (!markets[0] || !markets[0].$.HomeTeam) return;
        // collect event details
        const id: string = event.$.Id;
        const name: string = markets[0].$.HomeTeam + " - " + markets[0].$.AwayTeam;
        const sportId: string = event.SportId;
        const countryId: string = event.CountryId;
        const leagueId: string = event.LeagueId;
        // event start date
        const date = event.$.StartDate.split("T")[0];
        const time = event.$.StartDate.split("T")[1];
        const startDate: Date = new Date();
        startDate.setUTCHours(Number(time.split(":")[0]) - 2, Number(time.split(":")[1]), Number(time.split(":")[2]))
        startDate.setUTCFullYear(Number(date.split("-")[0]), Number(date.split("-")[1]) - 1, Number(date.split("-")[2]))
        // parse participants
        const participants = this.parseParticipants(markets[0]['$']);
        // add event to db
        await this.eventService.addEvent(id, name, EventType.PRE_MATCH, startDate, EventStatus.ACTIVE, sportId, countryId, leagueId, participants);
        // process markets
        return map(markets, async market => {
            // if parser stopped return
            if (ParserBase.stopped) return;
            // set market details
            market.SportId = sportId;
            market.EventId = id;
            market.Participants = participants;
            // process market
            return this.successor.processRequest(market).catch(err => {
                console.log("EventMarketParser Error: ");
                console.log(err);
            });
        }, { concurrency: 10 });
    }

    private parseParticipants(event: any): IFeedParticipant[] {
        const returnParticipants: IFeedParticipant[] = [];
        // home participant
        returnParticipants.push({
            id: event.HomeTeam,
            name: event.HomeTeam,
            type: "Home"
        })
        // away participant
        returnParticipants.push({
            id: event.AwayTeam,
            name: event.AwayTeam,
            type: "Away"
        })
        return returnParticipants;
    }
}