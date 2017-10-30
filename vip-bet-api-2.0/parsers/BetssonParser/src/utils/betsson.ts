import { HTTPUtil } from "./httpUtil";

export interface IBSData {
    Category: IBSCategory[];
}

export interface IBSCategory {
    CategoryID: string;
    CategoryName: string;
    CategoryParentID: string;
    CategoryParentName: string;
    CategoryEvents: IBSCategoryEvents[];
}
export interface IBSCategoryEvents {
    EventID: string;
    EventName: string;
    EventDeadline: Date;
    EventMarkets: IBSEventMarkets[];
}
export interface IBSEventMarkets {
    MarketID: string;
    BetGroupID: string;
    BetGroupName: string;
    MarketDeadline: Date;
    MarketStatusID: string;
    MarketStatusName: string;
    MarketSelections: IBSMarketSelections[];
}
export interface IBSMarketSelections {
    SelectionID: string;
    MarketID: string;
    Odds: any[];
    SelectionLimitValue: string;
    SelectionStatus: string;
    SelectionStatusName: string;
    SelectionName: string;
}

export class BetssonService {
    private static API = {
        CATEGORIES: "http://xmlfeeds.coral.co.uk/oxi/pub?template=getCategories",
        CLASSES: "http://xmlfeeds.coral.co.uk/oxi/pub?template=getClasses",
        CLASS_RESULTS: (id) => `http://xmlfeeds.coral.co.uk/oxi/pub?template=getResultsByClass&class=${id}&returnPoolInfo=Y`,
        CLASS_TYPES: (id) => `http://xmlfeeds.coral.co.uk/oxi/pub?template=getTypes&class=${id}`,
        CLASS_EVENTS: (id) => `http://xmlfeeds.coral.co.uk/oxi/pub?template=getEvents&class=${id}`,
        TYPE_EVENTS: (id) => `http://xmlfeeds.coral.co.uk/oxi/pub?template=getEvents&type=${id}`,
        BIR_EVENTS: `http://xmlfeeds.coral.co.uk/oxi/pub?template=getEventsBIR`,
        EVENT_DETAILS: (eventIds: number[]) => `http://xmlfeeds.coral.co.uk/oxi/pub?getEventDetails?event={${eventIds.join(',')}}`
    }

    public static async getCategories(): Promise<IBSCategory[]> {
        return HTTPUtil.scheduleGetData(BetssonService.API.CATEGORIES);
    }
}