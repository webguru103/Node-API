import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";

/**
 * Created by   on 4/5/2017.
 */
export class BetTypeUtil {
    static betTypes: any = {};
    static outcomeTypes: any = {};

    static getStatus(providerStatus: string) {
        switch (providerStatus) {
            case "open":
                return EventStatus.ACTIVE;
            case "paused":
                return EventStatus.SUSPENDED;
        }
        return EventStatus.ACTIVE;
    }

    static getOutcomeType(name: string) {
        return this.outcomeTypes[name];
    }

    static getBetType(name: string) {
        return this.betTypes[name];
    }
}