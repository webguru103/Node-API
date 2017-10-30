import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { IEventResult, IStatisticResult } from "../interfaces/event_result.interface";
import { merge } from "lodash";

export class EventResult extends BaseModel implements IEventResult {
    public static tableName = "event_result";
    public id: number;
    public results: IStatisticResult[];

    constructor(data: IEventResult) {
        super();
        this.id = data.id;
        this.results = data.results;
    }
    
    public async saveWithID(conflictRule?: string): Promise<any> {
        const objToSave = Object.assign({}, this);
        objToSave.results = this.results.map(r => <any>JSON.stringify(r));
        this.id = await BaseModel.saveWithID(this, objToSave, conflictRule);;
        return this;
    }

    public async update(data: IEventResult = this, byFields: any = { id: this.id }): Promise<IEventResult> {
        merge(this, data);
        const objToSave = Object.assign({}, this);
        objToSave.results = this.results.map(r => <any>JSON.stringify(r));
        await BaseModel.update(this, objToSave, byFields);
        return this;
    }
}