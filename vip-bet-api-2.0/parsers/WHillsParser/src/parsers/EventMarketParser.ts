/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { parseMarket } from "../utils/market.util";
import { IEventMarketService } from "../../../BaseParser/src/bll/abstract/IEventMarketService";
import { EventMarketService } from "../../../BaseParser/src/bll/services/EventMarketService";
import { map } from "bluebird";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";

export class EventMarketParser extends ParserBase {
    private eventMarketService: IEventMarketService = new EventMarketService();
    async processRequest(market: any) {
        if (market['$'].name.indexOf("#YourOdds") != -1 || market['$'].name.indexOf("Your Odds") != -1) return;

        let sportId: string = market.sportId;
        let eventId: string = market.eventId;
        let id = market['$'].id;
        let marketTypeTemp = this.splitMarketName(market['$'].name);
        if (marketTypeTemp === undefined) return;

        let marketType = marketTypeTemp.substring(marketTypeTemp.search(" - ") + 3);
        let name: string = this.replaceSelectionName(marketType, market.participants);

        let parsedMarket = parseMarket(name);
        name = parsedMarket.name;
        marketType = name;
        if (marketType.indexOf("Top Home Batsman") != -1
            || marketType.indexOf("Top Away Batsman") != -1
            || marketType.indexOf("Top Home Bowler") != -1
            || marketType.indexOf("Top Away Bowler") != -1
            || marketType.indexOf("Enhanced Odds") != -1
            || marketType.indexOf("To Score In ") != -1
            || marketType.indexOf("Goalscorer") != -1
            || marketType.indexOf("Goals x Cards") != -1
            || marketType.indexOf("Goals x Corners") != -1
            || (marketType.indexOf("Corner") != -1 && marketType.indexOf("Card") != -1)
            || (marketType.indexOf(" To Score And ") != -1 && marketType.indexOf(" To Win ") != -1)
            || (marketType.indexOf("Hat-trick") != -1)
            || (marketType.indexOf("Marcatore") != -1)
            || (marketType.indexOf("Player Scores") != -1)
            || (marketType.indexOf("Anytime Wincast") != -1)
            || (marketType.indexOf("Anytime Scorecast") != -1)
            || (marketType.indexOf("Player To Be") != -1)
            || (marketType.indexOf("Treble") != -1)
            || (marketType.indexOf("Total Bases Match Bet") != -1)
            || (sportId == "BASKETBALL" && (marketType.indexOf(" Assists Handicap Match Be") != -1))
            || (sportId == "BASKETBALL" && (marketType.indexOf("Assists Handicap Goal") != -1))
            || (sportId == "BASKETBALL" && (marketType.indexOf(" Handicap Goal") != -1))
            || (sportId == "BASKETBALL" && (marketType.indexOf(" + Rebounds + Assists") != -1))
            || (sportId == "BASKETBALL" && (marketType.indexOf(" Points Match Bet") != -1))
            || (sportId == "BASKETBALL" && (marketType.indexOf(" Total Points") != -1
                && marketType.indexOf(" - Total Points") == -1
                && marketType.indexOf("- 1st Half Total Points") == -1
                && marketType.indexOf("- 1st Quarter  Total Points") == -1
                && marketType.indexOf("- 2nd Half Total Points") == -1
                && marketType.indexOf("- 2nd Quarter  Total Points") == -1
                && marketType.indexOf("- 3rd Half Total Points") == -1
                && marketType.indexOf("- 3rd Quarter  Total Points") == -1
                && marketType.indexOf("- 4th Half Total Points") == -1
                && marketType.indexOf("- 4th Quarter  Total Points") == -1))
            || (marketType.indexOf("Top ") != -1 && marketType.indexOf(" Bowler") != -1)
            || (marketType.indexOf("Top ") != -1 && marketType.indexOf(" Batsman") != -1)
            || (marketType.indexOf("Player To Score") != -1)
        ) return;

        await this.eventMarketService.addEventMarket(id, name, EventStatus.ACTIVE, eventId, marketType, sportId);
        return map(market.participant, async (odd) => {
            if (ParserBase.stopped) return;
            let selection = <any>odd;

            selection['eventMarketId'] = id;
            selection['status'] = EventStatus.ACTIVE;
            selection['sportId'] = sportId;
            selection['marketType'] = marketType;
            if (!selection['$'].handicap) selection['$'].handicap = parsedMarket.argument;
            selection['participants'] = market.participants;
            return this.successor.processRequest(selection).catch(err => {
                console.log("EventMarketOutcomeParser Error: ");
                console.log(err);
            });
        }, { concurrency: 5 });
    }
    private splitMarketName(name): string | undefined {
        if (name.includes(" @ ")) return name.split(" @ ")[1];
        else if (name.includes(" v ")) return name.split(" v ")[1];
        else if (name.includes(" V ")) return name.split(" V ")[1];
        else if (name.includes(" vs ")) return name.split(" vs ")[1];
        else if (name.includes(" VS ")) return name.split(" VS ")[1];
        else if (name.includes(" - ")) return name.split(" - ")[1];
        return
    }

    private replaceSelectionName(name: string, participants: any[]): string {
        participants.forEach(participant => {
            name = name.replace(new RegExp(participant.name, 'g'), participant.type)
        })
        return name;
    }
}