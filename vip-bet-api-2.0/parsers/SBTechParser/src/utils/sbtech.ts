import { IFeedParticipant } from "../../../BaseParser/src/interfaces/IFeedParticipant";

export interface ISBTechEvent {
    $: {
        ID: string;
        Branch: string;
        BranchID: string;
        DateTimeGMT: string;
        EventType: string;
        IsOption: string;
        League: string;
        LeagueID: string;
        MEID: string;
        Sport: string;
        EventName: string;
    },
    MarketType: string;
    SportId: string;
    LeagueId: string;
    MoneyLine: [ISBMoneyLine];
    Spread: [ISBSpread];
    Total: [ISBTotal];
    Participants: [ISBTechParticipant];
    FeedParticipants: IFeedParticipant[];
}

export interface ISBTechParticipant {
    Participant1: [{
        $: {
            Name: string;
            Home_Visiting: string
        }
    }],
    Participant2: [{
        $: {
            Name: string;
            Home_Visiting: string
        }
    }]
}

export interface ISBSelection {
    Id: string;
    Name: string;
    Odd: number;
    Argument?: number;
    SportId?: string;
    MarketType?: string;
    EventMarketId?: string;
}

export interface ISBMoneyLine {
    $: {
        Away: string;
        Draw: string;
        Home: string;
    }
}

export interface ISBSpread {
    $: {
        Away_Odds: string;
        Away_Points: string;
        Home_Odds: string;
        Home_Points: string;
    }
}

export interface ISBTotal {
    $: {
        Over: string;
        Points: string;
        Under: string;
    }
}