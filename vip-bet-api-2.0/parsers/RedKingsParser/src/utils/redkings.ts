import { IFeedParticipant } from "../../../BaseParser/src/interfaces/IFeedParticipant";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";

export interface IRKFileList {
    fileList: {
        file: IRKFile[]
    }
}
export interface IRKFile {
    _: string;
    $: {

    }
}

export interface IRKSport {
    $: {
        id: string;
        name: string
    };
    Country: IRKCountry[]
}

export interface IRKCountry {
    $: {
        id: string;
        name: string
    };
    SportId: string;
    Tournament: IRKLeague[]
}

export interface IRKLeague {
    $: {
        id: string;
        name: string
    };
    SportId: string;
    CountryId: string;
    Match: IRKEvent[];
}

export interface IRKEvent {
    $: {
        id: string;
        name: string;
    };
    StartDate: string;
    SportId: string;
    CountryId: string;
    LeagueId: string;
    MatchOdds: [{ BettingOffer: IRKMarket[] }]
    Participants: [{ Participant: IRKParticipant[] }]
}

export interface IRKParticipant {
    $: {
        id: string;
        name: string;
        type: string;
    };
}

export interface IRKMarket {
    $: {
        id: string;
        name: string;
        typeId: string;
        type: string;
        scope: string;
    };
    StartDate: string;
    SportId: string;
    CountryId: string;
    LeagueId: string;
    EventId: string;
    Participants: IFeedParticipant[];
    Odds: IRKOdd[]
}

export interface IRKOdd {
    $: {
        id: string;
        name: string;
        type: string;
        outcome: string;
        score: string;
        handicap: string;
        margin: string;
        corner: string;
        playerName: string;
        teamId: number;
    };
    _: number;
    EventMarketId: string;
    Status: EventStatus;
    SportId: string;
    MarketType: string;
    MarketTypeId: string;
    Participants: IFeedParticipant[];
}