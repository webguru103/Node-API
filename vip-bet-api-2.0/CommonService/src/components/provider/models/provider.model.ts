import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { isCron } from "../../../../../CommonJS/src/utils/utils";
import { ProviderStatus } from "../enums/provider.status";

export class Provider extends BaseModel {
    public static tableName = "provider";
    public id: number;
    public name: string;
    public status_id: ProviderStatus;
    public interval: string;
    public icon_url: string;
    public icon_small_url: string;
    public order_id: number;

    constructor(data: Provider) {
        super();
        this.id = data.id;
        this.name = data.name;
        this.status_id = data.status_id;
        this.interval = isCron(data.interval) ? data.interval : "0 */3 * * *";
        this.icon_url = data.icon_url;
        this.icon_small_url = data.icon_small_url;
        this.order_id = data.order_id;
    }
}