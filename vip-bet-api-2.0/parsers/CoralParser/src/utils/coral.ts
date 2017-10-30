import { ICoralCategory, ICoralClass, ICoralType, ICoralEvent, ICoralOutcome } from "./coral.interface";
import { HTTPUtil } from "./httpUtil";

export class CoralService {
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

    public static async getCategories(): Promise<ICoralCategory[]> {
        return HTTPUtil.scheduleGetData(CoralService.API.CATEGORIES);
    }

    public static async getClasses(): Promise<ICoralClass[]> {
        return HTTPUtil.scheduleGetData(CoralService.API.CLASSES);
    }

    public static async getClassTypes(classId: string): Promise<ICoralType[]> {
        return HTTPUtil.scheduleGetData(CoralService.API.CLASS_TYPES(classId));
    }

    public static async getClassResult(classId: string): Promise<ICoralClass[]> {
        return HTTPUtil.scheduleGetData(CoralService.API.CLASS_RESULTS(classId));
    }

    public static async getClassEvents(classId: string): Promise<ICoralEvent[]> {
        return HTTPUtil.scheduleGetData(CoralService.API.CLASS_EVENTS(classId));
    }

    public static async getTypeEvents(typeId: string): Promise<ICoralEvent[]> {
        return HTTPUtil.scheduleGetData(CoralService.API.TYPE_EVENTS(typeId));
    }

    public static async getBIREvents(): Promise<ICoralEvent[]> {
        return HTTPUtil.scheduleGetData(CoralService.API.BIR_EVENTS);
    }

    public static async getEventDetails(eventIds: number[]): Promise<ICoralOutcome[]> {
        return HTTPUtil.scheduleGetData(CoralService.API.EVENT_DETAILS(eventIds));
    }
}