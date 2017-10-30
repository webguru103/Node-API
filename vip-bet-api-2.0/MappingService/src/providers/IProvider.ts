/**
 * Created by   on 3/26/2017.
 */
export interface IProvider {
    getOdds(mapIds: string[]);
    getOdd(mapId: string): Promise<any>;
    getEventOdds(event_id: number): Promise<any[]>;
}