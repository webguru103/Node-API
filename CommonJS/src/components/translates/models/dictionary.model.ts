import { BaseModel } from "../../../../../CommonJS/src/base/base.model";

export class Dictionary extends BaseModel {
    public static tableName: string = "dictionary";
    public id: number;

    constructor(data: Dictionary) {
        super();
        this.id = data.id;
    }
}