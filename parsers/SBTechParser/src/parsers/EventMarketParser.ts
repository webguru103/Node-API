/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventMarketService } from "../../../BaseParser/src/bll/abstract/IEventMarketService";
import { EventMarketService } from "../../../BaseParser/src/bll/services/EventMarketService";
import { map, each } from "bluebird";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";
import { ISBTechEvent, ISBSelection } from "../utils/sbtech";

export class EventMarketParser extends ParserBase {
    private eventMarketService: IEventMarketService = new EventMarketService();
    private homeAwayMarkets: number[] = [7, 257];
    private potentialHomeAwayMarkets: number[] = [17, 18, 125];
    private ignore: number[] = [66, 76, 85, 135, 184, 186, 227, 402, 702, 737, 759];
    async processRequest(market: ISBTechEvent) {
        //return if market is not supported for parsing
        if (this.ignore.includes(Number(market.$.EventType))) return;
        //log markets
        if (this.potentialHomeAwayMarkets.includes(Number(market.$.EventType))) return;
        //parse market types which has names including "TEAM" and replace it with home/away
        if (this.homeAwayMarkets.includes(Number(market.$.EventType))) {
            const participantName = market.Participants[0].Participant1[0]["$"].Name;
            const participant = market.FeedParticipants.find(p => { return p.name === participantName });
            if (participant) market.MarketType = market.MarketType.replace("Team", participant.type);
        }
        //parse markets
        await this.parseMarket(market, "Total", this.parseTotal);
        await this.parseMarket(market, "Spread", this.parseSpread);
        await this.parseMarket(market, "MoneyLine", this.parseMoneyLine);
    }

    private async parseMarket(event: ISBTechEvent, marketName: string, selectionsParser: Function) {
        if (!event[marketName] || !event[marketName][0]['$']) return;
        const marketToParse = event[marketName][0]['$'];
        const name = event.MarketType + " - " + marketName;
        const id = event.$.MEID + "/" + name;
        //add market
        await this.eventMarketService.addEventMarket(id, name, EventStatus.ACTIVE, event.$.MEID, name, event.SportId);
        //parse market selections
        const selections: ISBSelection[] = await selectionsParser.apply(this, [id, marketToParse]);
        return each(selections, async selection => {
            if (ParserBase.stopped) return;
            selection.SportId = event.SportId;
            selection.MarketType = name;
            selection.EventMarketId = id;
            return this.successor.processRequest(selection);
        })
    }

    private async parseSpread(eventMarketId: string, market: any): Promise<ISBSelection[]> {
        const selections: ISBSelection[] = [];
        selections.push({
            Id: "0",
            Name: "Home",
            Odd: market.Home_Odds,
            Argument: market.Home_Points
        });
        selections.push({
            Id: "0",
            Name: "Away",
            Odd: Number(market.Away_Odds),
            Argument: market.Away_Points
        });
        return this.generateIds(eventMarketId, selections);
    }
    private async parseMoneyLine(eventMarketId: string, market: any): Promise<ISBSelection[]> {
        const selections: ISBSelection[] = [];
        selections.push({
            Id: "0",
            Name: "Home",
            Odd: Number(market.Home)
        });
        selections.push({
            Id: "0",
            Name: "Draw",
            Odd: Number(market.Draw)
        });
        selections.push({
            Id: "0",
            Name: "Away",
            Odd: Number(market.Away)
        });
        return this.generateIds(eventMarketId, selections);
    }
    private async parseTotal(eventMarketId: string, market: any): Promise<ISBSelection[]> {
        const selections: ISBSelection[] = [];
        selections.push({
            Id: "0",
            Name: "Over",
            Odd: Number(market.Over),
            Argument: market.Points
        });
        selections.push({
            Id: "0",
            Name: "Under",
            Odd: Number(market.Under),
            Argument: market.Points
        });
        return this.generateIds(eventMarketId, selections);
    }

    private async generateIds(eventMarketId: string, selections: ISBSelection[]): Promise<any[]> {
        return map(selections, async selection => {
            selection.Id = eventMarketId + "/" + selection.Name;
            if (selection.Argument) selection.Id += "/" + selection.Argument;
            return selection;
        })
    }
}