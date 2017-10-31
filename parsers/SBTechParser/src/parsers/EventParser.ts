/**
 * Created by   on 3/5/2017.
 */

import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventService } from "../../../BaseParser/src/bll/abstract/IEventService";
import { EventService } from "../../../BaseParser/src/bll/services/EventService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { map } from "bluebird";
import { toNumber } from "lodash";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { EventType } from "../../../../EventService/src/components/events/enums/event_type.enum";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";
import { ISBTechEvent, ISBTechParticipant } from "../utils/sbtech";

export class EventParser extends ParserBase {
    private eventService: IEventService = new EventService();
    private categoryService: ICategoryService = new CategoryService();
    private eventIdТоName: any = {};
    private eventNameToId: any = {};
    public eventsWithNames: any;
    async processRequest(markets: ISBTechEvent[]) {
        const eventWithParticipant = markets.find(e => {
            return e.Participants[0].Participant1
                && e.Participants[0].Participant2
                && e.Participants[0].Participant1[0].$.Name.length != 0
                && e.Participants[0].Participant2[0].$.Name.length != 0
        });
        // if not found return
        if (!eventWithParticipant) return;

        const event = markets[0];
        const id: string = event.$.MEID;
        let eventName = this.eventIdТоName[id];
        if (!eventName && eventWithParticipant) eventName = eventWithParticipant.Participants[0].Participant1[0].$.Name + " vs " + eventWithParticipant.Participants[0].Participant2[0].$.Name;
        if (!eventName) return;
        this.eventIdТоName[id] = eventName;
        this.eventNameToId[eventName] = id;

        const sportId = event.$.BranchID;
        const sportName = event.$.Branch;

        const leagueId = event.$.LeagueID;
        const leagueName = event.$.League;

        await this.categoryService.addCategory(sportId, CategoryType.SPORT, undefined, sportName);
        await this.categoryService.addCategory(sportId, CategoryType.SPORT_COUNTRY, sportId, sportName, sportId);
        await this.categoryService.addCategory(leagueId, CategoryType.LEAGUE, sportId, leagueName, sportId);

        const timeSplited = event.$.DateTimeGMT.split("/");
        const startDate: Date = new Date();
        startDate.setUTCFullYear(toNumber(timeSplited[2].split(" ")[0]), toNumber(timeSplited[1]) - 1, toNumber(timeSplited[0]));

        const time: string = timeSplited[2].split(" ")[1];
        startDate.setUTCHours(toNumber(time.split(":")[0]), toNumber(time.split(":")[1]), toNumber(time.split(":")[2]));

        const participants: any[] = this.parseParticipants(eventWithParticipant.Participants[0]);
        await this.eventService.addEvent(id, eventName.replace(" vs ", " - "), EventType.PRE_MATCH, startDate, EventStatus.ACTIVE, sportId, sportId, leagueId, participants);
        const eventWithoutID = this.eventsWithNames[eventName];
        if (eventWithoutID) {
            markets = markets.concat(eventWithoutID);
        }

        await map(markets, async market => {
            if (ParserBase.stopped) return;
            let allMarkets = ParserBase.markets;
            let marketTypeName = allMarkets[market.$.EventType];
            market.MarketType = marketTypeName
            market.SportId = sportId;
            market.LeagueId = leagueId;
            market.FeedParticipants = participants;
            return this.successor.processRequest(market).catch(err => {
                console.log("EventMarketParser Error: ");
                console.log(err);
            });
        }, { concurrency: 5 })
    }

    private parseParticipants(participants: ISBTechParticipant) {
        const returnParticipants: any[] = [];
        const part1 = {
            id: participants.Participant1[0].$.Name,
            name: participants.Participant1[0].$.Name,
            type: participants.Participant1[0].$.Home_Visiting == "Home" ? "Home" : "Away"
        };
        returnParticipants.push(part1);

        const part2 = {
            id: participants.Participant2[0].$.Name,
            name: participants.Participant2[0].$.Name,
            type: participants.Participant2[0].$.Home_Visiting == "Home" ? "Home" : "Away"
        };
        returnParticipants.push(part2);

        return returnParticipants;
    }
}