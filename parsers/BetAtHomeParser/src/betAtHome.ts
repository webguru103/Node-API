import { IFeedParticipant } from "../../BaseParser/src/interfaces/IFeedParticipant";

export interface IBetAtHomeData {
    Sport?: IBetAtHomeSport[];
}
export interface IBetAtHomeSport {
    $: {
        Id: string;
        Name: string;
    };
    Region: IBetAtHomeRegion[];
}

export interface IBetAtHomeRegion {
    $: {
        Id: string;
        Name: string;
    };
    SportId: string;
    EventGroup?: IBetAtHomeEventGroup[];
}

export interface IBetAtHomeEventGroup {
    $: {
        Id: string;
        Name: string;
    };
    SportId: string;
    CountryId: string;
    SportEvent: IBetAtHomeSportEvent[]
}

export interface IBetAtHomeSportEvent {
    $: {
        Id: string;
        Name: string;
        StartDate: string;
        NeutralGround: boolean;
    };
    SportId: string;
    CountryId: string;
    LeagueId: string;
    Bet: IBetAtHomeBet[];
}


export interface IBetAtHomeBet {
    $: {
        Id: string;
        Name: string;
        BetTypeId: string;
        HomeTeam: string;
        AwayTeam: string;
        DefaultName: string;
        Param1?: number;
        Param2?: number;
    };
    SportId: string;
    EventId: string;
    Participants: IFeedParticipant[];
    Odds: IBetAtHomeOdds[];
}

export interface IBetAtHomeOdds {
    Odd: IBetAtHomeOdd[];
}

export interface IBetAtHomeOdd {
    $: {
        Id: string;
        Name: string;
        Value: number;
    };
    SportId: string;
    EventId: string;
    Participants: IFeedParticipant[];
    Argument1?: number;
    Argument2?: number;
    EventMarketId: string;
    MarketType: string;
    MarketTypeId: string;
}