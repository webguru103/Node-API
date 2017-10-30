/**
 * Created by   on 3/5/2017.
 */

import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventService } from "../../../BaseParser/src/bll/abstract/IEventService";
import { EventService } from "../../../BaseParser/src/bll/services/EventService";
import { map } from "bluebird";
import { IBetWayEvent, IBetWayKeyword } from "../betway";
import { ICategoryService } from "../../../BaseParser/src/bll/abstract/ICategoryService";
import { CategoryService } from "../../../BaseParser/src/bll/services/CategoryService";
import { IFeedParticipant } from "../../../BaseParser/src/interfaces/IFeedParticipant";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { EventType } from "../../../../EventService/src/components/events/enums/event_type.enum";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";

export class EventParser extends ParserBase {
    private eventService: IEventService = new EventService();
    private categoryService: ICategoryService = new CategoryService();

    async processRequest(event: IBetWayEvent) {
        // event markets
        const markets = event.Market;
        // if there is no markets
        if (!markets) return;
        // replace [ and ] in keywords
        event.Keywords.map(keyword => {
            keyword.Keyword.map(k => {
                k._ = k._.replace(/[\[\]]/g, "");
            })
        })

        // collect event details
        const id: string = event.$.id;
        const name: string = event.Name[0];
        const sportId = (event.Keywords[0].Keyword.find(k => k.$.type_cname === "sport") || <IBetWayKeyword>{ _: "" })._;
        const countryId = (event.Keywords[0].Keyword.find(k => k.$.type_cname === "country") || <IBetWayKeyword>{ _: "" })._;
        const leagueId = (event.Keywords[0].Keyword.find(k => k.$.type_cname === "league") || <IBetWayKeyword>{ _: "" })._;
        // if some of categories missing return
        if (!sportId || !countryId || !leagueId) return;
        // add categories
        await this.categoryService.addCategory(sportId, CategoryType.SPORT, undefined, sportId);
        await this.categoryService.addCategory(countryId, CategoryType.SPORT_COUNTRY, sportId, countryId);
        await this.categoryService.addCategory(leagueId, CategoryType.LEAGUE, countryId, leagueId, sportId);
        // event start date
        const startDate: Date = new Date(event.$.start_at);
        // parse participants
        const participants = this.parseParticipants(event);
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
        });
    }

    private parseParticipants(event: IBetWayEvent): IFeedParticipant[] {
        const returnParticipants: any[] = [];
        // home participant
        returnParticipants.push({
            id: event.$.home_team_cname,
            name: (event.Keywords[0].Keyword.find(k => k.$.cname === event.$.home_team_cname) || <IBetWayKeyword>{ _: event.$.home_team_cname })._,
            type: "Home"
        })
        // away participant
        returnParticipants.push({
            id: event.$.away_team_cname,
            name: (event.Keywords[0].Keyword.find(k => k.$.cname === event.$.away_team_cname) || <IBetWayKeyword>{ _: event.$.away_team_cname })._,
            type: "Away"
        })
        return returnParticipants;
    }
}