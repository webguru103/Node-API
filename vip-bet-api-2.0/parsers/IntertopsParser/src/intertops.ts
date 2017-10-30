import { IFeedParticipant } from "../../BaseParser/src/interfaces/IFeedParticipant";
import { queueRequest } from "../../../CommonJS/src/utils/http.util";

export class Intertops {
    private static API_TOKEN = "4a29702b-9699-e711-8aa0-003048dd52d5";
    private static API_URL = "http://xmlfeed.intertops.com";
    private static API_VERSION = "v2";
    private static API = {
        DATA: (delta: number) => `${Intertops.API_URL}/xmloddsfeed/${Intertops.API_VERSION}/xml/feed.ashx?apikey=${Intertops.API_TOKEN}&delta=${delta}`,
    }

    public static async getData(delta: number): Promise<IData> {
        return queueRequest(Intertops.API.DATA(delta));
    }
}

export interface IData {
    result: IResult
}

export interface IResult {
    data: [{ s: ISport[] }]
}

export interface ISport {
    $: {
        id: string;
        n: string;
    };
    cat: ILeague[];
}
export interface ILeague {
    $: {
        id: string;
        n: string;
    };
    sportId: string;
    countryId: string;
    m: IEvent[];
}
export interface IEvent {
    $: {
        id: string;
        n: string;
        dt: string;
        eid: string;
        mid: string;
    };
    sportId: string;
    countryId: string;
    leagueId: string;
    t: IMarket[];
}

export interface IMarket {
    $: {
        id: string;
        n: string;
    };
    sportId: string;
    countryId: string;
    leagueId: string;
    eventId: string;
    l: ISelection[];
    participants: IFeedParticipant[];
}

export interface ISelection {
    _: string;
    $: {
        id: string;
        o: string;
        p: string;
    };
    sportId: string;
    countryId: string;
    leagueId: string;
    eventId: string;
    marketId: string;
    marketName: string;
    eventMarketId: string;
    participants: IFeedParticipant[];
}