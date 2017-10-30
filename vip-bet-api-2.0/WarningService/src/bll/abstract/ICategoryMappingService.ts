/**
 * Created by   on 3/27/2017.
 */
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";

export interface ICategoryMappingService {
    addWarning(providerId: number, providerCategoryId: string, providerCategoryName: string, providerParentCategoryName: string, categoryType: CategoryType);
    removeWarning(providerId: number, providerCategoryId: string, categoryType: CategoryType);
    getWarnings(page: number, limit: number);
    getWarningsCount();
}