export interface ICoralData {
    Category: ICoralCategory
}

export interface ICoralCategory {
    id: string;
    name: string;
    channels: ICoralClass[];
    lastUpdatedDate: string;
    lastUpdatedTime: string;
}
export interface ICoralClass {
    id: string;
    name: string;
    channels: ICoralClass[];
    lastUpdatedDate: string;
    lastUpdatedTime: string;
}
export interface ICoralResult {
    id: string;
    name: string;
    channels: ICoralClass[];
    lastUpdatedDate: string;
    lastUpdatedTime: string;
}
export interface ICoralType {
    id: string;
    name: string;
    channels: ICoralClass[];
    country: string;
    region: string;
    lastUpdatedDate: string;
    lastUpdatedTime: string;
}

export interface ICoralEvent {
    id: string;
    name: string;
    displayed: string;
    lastUpdatedDate: string;
    lastUpdatedTime: string;
}
export interface ICoralMarket {
    id: string;
    name: string;
    type: string;
    sort: string;
    status: string;
    unformattedHandicap: string;
    handicap: string;
    placeAvailable: string;
}
export interface ICoralOutcome {
    id: string;
    name: string;
    status: string;
    eventId: string;
    oddsDecimal: string;
    resultType: string;
    handicap: string;
    lastUpdatedDate: string;
    lastUpdatedTime: string;
}