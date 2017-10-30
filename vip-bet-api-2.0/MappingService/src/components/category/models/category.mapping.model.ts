import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { ICategoryMapping } from "../interfaces/category.mapping.interface";
import { CategoryStatus } from "../../../../../CategoryService/src/components/category/enums/category_status.enum";
import { CategoryType } from "../../../../../CategoryService/src/components/category/enums/category_type.enum";

export class CategoryMapping extends BaseModel implements ICategoryMapping {
    public static tableName: string = "category_mapping";
    public id: number;
    public provider_id: number;
    public provider_category_id: string;
    public provider_category_status_id: CategoryStatus;
    public provider_category_name: string;
    public provider_parent_category_id?: string;
    public provider_sport_id?: string;
    public category_type: CategoryType;
    public system_category_id: number;

    constructor(data: ICategoryMapping) {
        super();
        this.id = data.id;
        this.provider_id = data.provider_id;
        this.provider_category_id = data.provider_category_id;
        this.provider_category_name = data.provider_category_name;
        this.provider_category_status_id = data.provider_category_status_id;
        this.provider_parent_category_id = data.provider_parent_category_id;
        this.provider_sport_id = data.provider_sport_id;
        this.category_type = data.category_type;
        this.system_category_id = data.system_category_id;
    }
}