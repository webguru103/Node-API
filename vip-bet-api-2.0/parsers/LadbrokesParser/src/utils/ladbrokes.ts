import { queueRequest } from "../../../../CommonJS/src/utils/http.util";
import { IFeedParticipant } from "../../../BaseParser/src/interfaces/IFeedParticipant";

export class Ladbrokes {
    //base url of ladbrokes's api
    private static BASE_URL: string = "https://sandbox-api.ladbrokes.com/v2/sportsbook-api";
    //ladbrokes api-key
    private static KEY: string = "LADb6553336402f4111b074d5ecae91b237";
    //locale for translation
    private static LOCALE: string = "en-GB";
    private static API = {
        CLASSES: `${Ladbrokes.BASE_URL}/classes?howmany=200&api-key=${Ladbrokes.KEY}&locale=${Ladbrokes.LOCALE}`,
        CLASS_EVENTS: (classId: number) => `${Ladbrokes.BASE_URL}/classes/${classId}?expand=event&no-links=1&howmany=200&filter=event.is-open-event&api-key=${Ladbrokes.KEY}&locale=${Ladbrokes.LOCALE}`,
        RESULTS: (eventId: number) => `${Ladbrokes.BASE_URL}/classes/null/types/null/events/${eventId}/result?api-key=${Ladbrokes.KEY}&locale=${Ladbrokes.LOCALE}`,
        EVENT_WITH_SELECTIONS: (eventId: number) => `${Ladbrokes.BASE_URL}/classes/null/types/null/events/${eventId}?expand=selection&no-links=1&api-key=${Ladbrokes.KEY}&locale=${Ladbrokes.LOCALE}`
    }
    public static async GetClasses(): Promise<ILBRoot> {
        return queueRequest(Ladbrokes.API.CLASSES);
    }
    public static async GetClassEvents(classId: number): Promise<ILBRoot> {
        return queueRequest(Ladbrokes.API.CLASS_EVENTS(classId));
    }
    public static async GetEventResult(eventId: number): Promise<IEventResult> {
        return queueRequest(Ladbrokes.API.RESULTS(eventId));
    }
    public static async GetEventWithSelections(eventId: number): Promise<IEventSelections> {
        return queueRequest(Ladbrokes.API.EVENT_WITH_SELECTIONS(eventId));
    }
}

export interface ILBRoot {
    classes: {
        class: IClass[] | IClass
    }
}

export interface IClass {
    classKey: number;
    types: {
        type: IType[] | IType
    },
    links: {
        link: ILink
    }
}

export interface ILink {
    title: string
}

export interface IType {
    classKey: number;
    typeKey: number;
    typeName: string;
    title: string;
    subtypes: {
        subtype: ISubType[] | ISubType
    }
}

export interface ISubType {
    classKey: number;
    typeKey: number;
    subTypeKey: number;
    subTypeName: string;
    events: {
        event: IEvent | IEvent[]
    }
}

export interface IEventResult {
    event: IEvent
}

export interface IEventSelections {
    event: IEvent
}

export interface IEvent {
    classKey: number;
    typeKey: number;
    subTypeKey: number;
    eventKey: number;
    eventName: string;
    eventDateTime: string;
    markets: {
        market: IMarket | IMarket[]
    }
}

export interface IMarket {
    classKey: number;
    typeKey: number;
    subTypeKey: number;
    eventKey: number;
    marketKey: number;
    selections: {
        selection: ISelection | ISelection[]
    };
    participants: IFeedParticipant[];
    marketCollectionName: string;
    marketName: string;
    handicapValue: number;
    rawHandicapValue: number;
    isHandicapMarket: boolean;
    marketMeaningMinorCode: string;
    marketMeaningMajorCode: string;
}

export interface ISelection {
    participants: IFeedParticipant[];
    selectionKey: number;
    classKey: number;
    marketKey: number;
    marketName: string;
    argument: number;
    isHandicapMarket: boolean;
    marketMeaningMinorCode: string;
    marketMeaningMajorCode: string;
    outcomeMeaningMajorCode: string;
    outcomeMeaningMinorCode: string;
    selectionName: string;
    selectionStatus: string;
    currentPrice: {
        decimalPrice: number;
    }
}
