/**
 * Created by   on 3/5/2017.
 */

import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventService } from "../../../BaseParser/src/bll/abstract/IEventService";
import { EventService } from "../../../BaseParser/src/bll/services/EventService";
import { map } from "bluebird";
import { toNumber } from "lodash";
import { IFeedParticipant } from "../../../BaseParser/src/interfaces/IFeedParticipant";
import { IBet365Event, IBet365Market, IBet365Data } from "../utils/bet365.interface";
import { EventType } from "../../../../EventService/src/components/events/enums/event_type.enum";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";
import { queueRequest } from "../../../../CommonJS/src/utils/http.util";

export class EventParser extends ParserBase {
    private eventService: IEventService = new EventService();

    async processRequest(event: IBet365Event) {
        // collect event details
        const id: string = event.$.ID;
        const name: string = event.$.Name.replace(" - " + event.LeagueName, "").replace(event.LeagueName + " - ", "");
        const sportId: string = event.SportID;
        const countryId: string = event.CountryID;
        const leagueId: string = event.LeagueID;
        // event start date
        const splitedDate = event.$.StartTime.split(" ")[0].split('/');
        const splitedTime = event.$.StartTime.split(" ")[1].split(':');
        const startDate: Date = new Date();
        startDate.setUTCFullYear(toNumber("20" + splitedDate[2]), toNumber(splitedDate[1]) - 1, toNumber(splitedDate[0]));
        startDate.setUTCHours(toNumber(splitedTime[0]), toNumber(splitedTime[1]), toNumber(splitedTime[2]));
        startDate.setHours(startDate.getHours() - 1);
        // parse participants
        const participants: any[] = this.parseParticipants(event);
        if (participants.length < 2) return;
        // add event to db
        await this.eventService.addEvent(id, name, EventType.PRE_MATCH, startDate, EventStatus.ACTIVE, sportId, countryId, leagueId, participants);
        // get event with all markets
        const data: IBet365Data = await queueRequest(`${event.SportURL}?EventID=${event.$.ID}`);
        // get event markets
        const markets: IBet365Market[] = [];
        if (data.Sport.EventGroup === undefined) return;
        // push all markets into markets. Since same event can be with different ids using map
        await map(data.Sport.EventGroup[0].Event, async event => markets.push.apply(markets, event.Market))
        // if no bets found
        if (markets === undefined) return;
        // process markets
        return map(markets, async market => {
            // sort market in order to keep them by versions
            if (ParserBase.stopped) return;
            market.SportID = sportId;
            market.CountryID = countryId;
            market.LeagueID = leagueId;
            market.EventID = id;
            market.Participants = participants;
            market.Participant = market.Participant.map(p => p['$']);
            return this.successor.processRequest(market).catch(err => {
                console.log("EventMarketParser Error: ");
                console.log(err);
            });
        }, { concurrency: 5 });
    }

    private parseParticipants(event: IBet365Event): IFeedParticipant[] {
        const returnParticipants: IFeedParticipant[] = [];
        // home participant
        let parts: string[] = event.$.Name.split(" v ");
        if (parts.length < 2) parts = event.$.Name.split(" @ ").reverse();
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