import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { ISelectionMapping } from "../interfaces/selection.mapping.interface";

export class SelectionMapping extends BaseModel implements ISelectionMapping {
    public static tableName: string = "selection_mapping";
    public id: number;
    public provider_id: number;
    public provider_selection_id: string;
    public provider_selection_name: string;
    public provider_market_id: string;
    public provider_category_id: string;
    public system_selection_id?: number;

    constructor(data: ISelectionMapping) {
        super();
        this.id = data.id;
        this.provider_id = data.provider_id;
        this.provider_category_id = data.provider_category_id;
        this.provider_market_id = data.provider_market_id;
        this.provider_selection_id = data.provider_selection_id;
        this.provider_selection_name = data.provider_selection_name;
        this.system_selection_id = data.system_selection_id;
    }
}