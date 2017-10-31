import { IFeedParticipant } from "../../../BaseParser/src/interfaces/IFeedParticipant";

export interface IBet365Data {
    Sport: IBet365Sport
}

export interface IBet365Sport {
    ID: string;    
    $: {
        Name: string;
    };
    EventGroup: IBet365League[];
}
export interface IBet365League {
    $: {
        ID: string;
        Name: string;
        name: string;
    };
    SportID: string;
    CountryID: string;
    Event: IBet365Event[];
    SportURL: string;
}
export interface IBet365Event {
    $: {
        ID: string;
        Name: string;
        StartTime: string;
    };
    SportID: string;
    CountryID: string;
    LeagueID: string;
    LeagueName: string;
    Market: IBet365Market[];
    SportURL: string;
}

export interface IBet365Market {
    $: {
        ID: string;
        Name: string;
        PlaceCount: string;
        PlaceOdds: string;
    };
    SportID: string;
    CountryID: string;
    LeagueID: string;
    EventID: string;
    EventComment: string;
    Participant: IBet365Participant[];
    Participants: IFeedParticipant[];
}

export interface IBet365Participant {
    ID: string;
    Name: string;
    SportID: string;
    CountryID: string;
    LeagueID: string;
    EventID: string;
    MarketID: string;
    MarketName: string;
    EventMarketID: string;
    Participants: IFeedParticipant[];
    OddsDecimal: string;
    Handicap: string;
}