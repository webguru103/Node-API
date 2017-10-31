import { IBase } from "../../../../../CommonJS/src/base/base.interface";
import { CategoryStatus } from "../../../../../CategoryService/src/components/category/enums/category_status.enum";
import { CategoryType } from "../../../../../CategoryService/src/components/category/enums/category_type.enum";

export interface ICategoryMapping extends IBase {
    id: number;
    provider_id: number;
    provider_category_id: string;
    provider_category_status_id: CategoryStatus;
    provider_category_name: string;
    provider_parent_category_id?: string;
    provider_sport_id?: string;
    category_type: CategoryType;
    system_category_id: number;
}