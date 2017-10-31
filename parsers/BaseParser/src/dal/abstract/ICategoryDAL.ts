import { CategoryType } from "../../../../../CategoryService/src/components/category/enums/category_type.enum";

/**
 * Created by   on 3/5/2017.
 */
export interface ICategoryDAL {
    addCategory(id: string, type: CategoryType, mapId: number, parentId: string | undefined, name: string);
    isCategory(id: string, type: CategoryType);
}