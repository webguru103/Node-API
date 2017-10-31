import { CategoryStatus } from "../enums/category_status.enum";
import { CategoryType } from "../enums/category_type.enum";

export interface ICategory {
    id: number;
    name?: string;
    type_id: CategoryType;
    dict_id?: number;
    lang_id?: number;
    parent_id?: number;
    status_id?: CategoryStatus;
    order_id?: number;
    icon_url?: string;
    icon_small_url?: string;
}

export interface ICategoryPublic extends ICategory {
    parent_name?: string;
    events_count?: number;
    name: string
}