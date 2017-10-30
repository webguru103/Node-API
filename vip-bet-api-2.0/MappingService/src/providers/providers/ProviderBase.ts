import { IProvider } from "../IProvider";

export class ProviderBase implements IProvider {
    protected db: any
    getOdd(mapId: string) {
        let query = `select map_id, odd, status from event_selection where map_id = $1;`;
        return this.db.oneOrNone(query, [mapId]).catch(err => {
            console.error(err);
        });
    }
    getOdds(mapIds: string[]) {
        if (mapIds.length == 0) return [];
        let query = `select map_id, odd, status from event_selection where map_id in ($1:csv);`;
        return this.db.manyOrNone(query, [mapIds]).catch(err => {
            console.error(err);
        });
    }
    getEventOdds(event_id: number): Promise<any[]> {
        const query = `select event_selection.map_id, event_selection.odd, event_selection.status 
                        from event_selection
                        join event_market on event_market.id = event_selection.event_market_id
                        join event on event.id = event_market.event_id
                        where event.id = $1;`;
        return this.db.manyOrNone(query, [event_id]).catch(err => {
            console.error(err);
        });
    }
}