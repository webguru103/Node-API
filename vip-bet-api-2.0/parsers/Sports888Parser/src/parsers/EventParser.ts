/**
 * Created by   on 3/5/2017.
 */

import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventService } from "../../../BaseParser/src/bll/abstract/IEventService";
import { EventService } from "../../../BaseParser/src/bll/services/EventService";
import { URLFactory } from "../utils/urlFactory";
import { HTTPUtil } from "../utils/httpUtil";
import { each, map } from "bluebird";
import { groupBy, sortBy } from "lodash";
import { IFeedParticipant } from "../../../BaseParser/src/interfaces/IFeedParticipant";
import { EventType } from "../../../../EventService/src/components/events/enums/event_type.enum";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";

export class EventParser extends ParserBase {
    private eventService: IEventService = new EventService();

    async processRequest(event) {
        // collect event details
        const id: string = event.id;
        const name: string = event.name;
        const sportId: string = event.sportId;
        const countryId: string = event.countryId;
        const leagueId: string = event.leagueId;
        // event start date
        const startDate: Date = new Date(event.start);
        // parse participants
        const participants = this.parseParticipants(event);
        // add event to db
        await this.eventService.addEvent(id, name, EventType.PRE_MATCH, startDate, EventStatus.ACTIVE, sportId, countryId, leagueId, participants);
        // get event markets
        let reqObj = URLFactory.getRequest(`https://e1-api.aws.kambicdn.com/offering/api/v2/888dk/betoffer/event/${id}.json?lang=en_GB&market=ALL`);
        let data = await HTTPUtil.scheduleGetData(reqObj);
        let eventData = JSON.parse(data);
        // event markets
        let markets: any[] = eventData.betoffers;
        // if no bets found
        if (!markets) return;
        // group market by bet offer type
        const grouppedMarkets = groupBy(markets, m => m.betOfferType.id);
        // process markets
        return map(Object.keys(grouppedMarkets), key => {
            // sort market in order to keep them by versions
            sortBy(grouppedMarkets[key], 'id');
            return each(grouppedMarkets[key], market => {
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
            });
        }, { concurrency: 5 });
    }

    private parseParticipants(event: any): IFeedParticipant[] {
        const returnParticipants: IFeedParticipant[] = [];
        // home participant
        returnParticipants.push({
            id: event.homeName,
            name: event.homeName,
            type: "Home"
        })
        // away participant
        returnParticipants.push({
            id: event.awayName,
            name: event.awayName,
            type: "Away"
        })
        return returnParticipants;
    }
}