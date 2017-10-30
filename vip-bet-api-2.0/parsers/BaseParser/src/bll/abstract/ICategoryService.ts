import { CategoryType } from "../../../../../CategoryService/src/components/category/enums/category_type.enum";

/**
 * Created by   on 3/5/2017.
 */
export interface ICategoryService {
    addCategory(id: string, type: CategoryType, parentId: string | undefined, name: string, sportId?: string): Promise<any>;
    isCategory(id: string, type: CategoryType);
}