/**
 * Created by   on 3/4/2017.
 */
import { IEventMappingDAL } from "./abstract/IEventMappingDAL";
import { BaseModel } from "../../../CommonJS/src/base/base.model";
import { IEventMapping } from "../components/event/interfaces/event.mapping.interface";

export class EventMappingDAL implements IEventMappingDAL {
    async addMap(providerId: number, providerEventId: string, startDate: string): Promise<number> {
        const query = `insert into event_mapping (provider_id, provider_event_id, start_date) values ($1, $2, $3)
                        on conflict ("provider_id", "provider_event_id") do update set provider_event_id=$2 RETURNING id;`;
        let data = await BaseModel.db.one(query, [providerId, providerEventId.toString(), startDate]);
        return data.id;
    }

    async map(mapId: number, systemEventId: number): Promise<IEventMapping> {
        const query = `update event_mapping 
                        set system_event_id = $2
                        where id = $1
                        returning *;`;
        return BaseModel.oneOrNone(query, [mapId, systemEventId]);
    }

    async getMappingByProviderIdAndEventId(providerId: number, providerEventId: string): Promise<IEventMapping> {
        const query = `select * from event_mapping 
                        where provider_id = $1
                        and provider_event_id = $2`;
        return BaseModel.oneOrNone(query, [providerId, providerEventId.toString()]);
    }

    async getMappings(systemEventId: number): Promise<IEventMapping[]> {
        const query = `select * from event_mapping 
                        where system_event_id = $1`;
        return BaseModel.manyOrNone(query, [systemEventId]);
    }

    async getMapping(providerId: number, systemEventId: number): Promise<IEventMapping[]> {
        const query = `select * from event_mapping 
                        where provider_id = $1
                        and system_event_id = $2 order by id desc limit 1`;
        return BaseModel.oneOrNone(query, [providerId, systemEventId]);
    }

    async unMapEvents(eventsId: number[]): Promise<any> {
        if (eventsId.length == 0) return;
        const query = `update event_mapping 
                        set system_event_id = null
                        where system_event_id in ($1:csv);`;
        return BaseModel.none(query, [eventsId]);
    }

    async getEventsProviders(event_ids: number[]): Promise<{ [key: string]: number }[]> {
        const query = `select system_event_id as event_id, provider_id from event_mapping 
                        where system_event_id in ($1:csv);`;
        return BaseModel.manyOrNone(query, [event_ids]);
    }
}