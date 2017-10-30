/**
 * Created by   on 3/5/2017.
 */

import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventService } from "../../../BaseParser/src/bll/abstract/IEventService";
import { EventService } from "../../../BaseParser/src/bll/services/EventService";
import { IFeedParticipant } from "../../../BaseParser/src/interfaces/IFeedParticipant";
import { EventType } from "../../../../EventService/src/components/events/enums/event_type.enum";
import { EventStatus } from "../../../../EventService/src/components/events/enums/event_status.enum";

export class EventParser extends ParserBase {
    private eventService: IEventService = new EventService();

    async processRequest(event) {
        Object.assign(event, event['$']);

        if (event.participant && event.participant.length > 3) return;

        const sportId: string = event.sportId;
        const countryId: string = event.countryId;
        const leagueId: string = event.leagueId;
        const startDate: Date = this.parseTime(event.date, event.time);
        const participants = this.parseParticipants(event.name);
        if (participants.length !== 2) return;

        const name = participants[0].name + " - " + participants[1].name;
        const id: string = name + event.date;
        await this.eventService.addEvent(id, name, EventType.PRE_MATCH, startDate, EventStatus.ACTIVE, sportId, countryId, leagueId, participants)

        event['eventId'] = id;
        event['participants'] = participants;

        return this.successor.processRequest(event).catch(err => {
            console.log("EventMarketParser Error: ");
            console.log(err);
        });
    }

    private parseTime(date: string, time: string): Date {
        const startDate: Date = new Date();
        const timeSplitted = time.split(':');
        startDate.setUTCHours(Number(timeSplitted[0]) - 1, Number(timeSplitted[1]), Number(timeSplitted[2]));
        const dateSplitted = date.split('-');
        startDate.setUTCFullYear(Number(dateSplitted[0]), Number(dateSplitted[1]) - 1, Number(dateSplitted[2]));
        return startDate;
    }

    private parseParticipants(name: string): IFeedParticipant[] {
        if (name.toLowerCase().includes(" winner ")
            || name.toLowerCase().includes(" winner")
            || name.toLowerCase().includes(" wins ")
            || name.toLowerCase().includes(" wins")
            || name.toLowerCase().includes(" outright ")
            || name.toLowerCase().includes(" outright")
            || name.toLowerCase().includes(" record")
            || name.toLowerCase().includes(" record ")
            || name.toLowerCase().includes(" loss ")
            || name.toLowerCase().includes(" loss")
            || name.toLowerCase().includes(" total ")
            || name.toLowerCase().includes(" total")
            || name.toLowerCase().includes("yourodds")
            || name.toLowerCase().includes("season")
        ) return [];
        let nameSplitted: string[] = [];
        if (name.includes(" @ ")) nameSplitted = name.split(" @ ");
        else if (name.includes(" v ")) nameSplitted = name.split(" v ");
        else if (name.includes(" V ")) nameSplitted = name.split(" V ");
        else if (name.includes(" vs ")) nameSplitted = name.split(" vs ");
        else if (name.includes(" VS ")) nameSplitted = name.split(" VS ");
        else if (name.includes(" - ")) nameSplitted = name.split(" - ");
        if (nameSplitted.length === 0) return [];

        nameSplitted[1] = nameSplitted[1].split(" - ")[0];
        if (nameSplitted[0].includes(" @ ")) nameSplitted = nameSplitted[0].split(" @ ");

        if (name.includes(" @ ")) nameSplitted.reverse();

        const participants: IFeedParticipant[] = []
        participants.push({
            id: nameSplitted[0],
            name: nameSplitted[0],
            type: "Home"
        });

        participants.push({
            id: nameSplitted[1],
            name: nameSplitted[1],
            type: "Away"
        });
        return participants;
    }
}