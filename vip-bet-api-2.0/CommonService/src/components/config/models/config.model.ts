import { BaseModel } from "../../../../../CommonJS/src/base/base.model";

export class ConfigModel extends BaseModel {
    public static tableName = "config";
    public config_type_id: number;
    public value: string;

    constructor(data: ConfigModel) {
        super();
        this.config_type_id = data.config_type_id;
        this.value = data.value;
    }
}