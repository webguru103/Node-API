/**
 * Created by   on 3/27/2017.
 */
import { ICategoryMappingService } from "../abstract/ICategoryMappingService";
import { ICategoryMappingDAL } from "../../dal/abstract/ICategoryMappingDAL";
import { CategoryMappingDAL } from "../../dal/CategoryMappingDAL";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";

export class CategoryMappingService implements ICategoryMappingService {
    private categoryMappingDAL: ICategoryMappingDAL = new CategoryMappingDAL();

    async addWarning(providerId: number, providerCategoryId: string, providerCategoryName: string, providerParentCategoryName: string, categoryType: CategoryType) {
        return this.categoryMappingDAL.addWarning(providerId, providerCategoryId, providerCategoryName, providerParentCategoryName, categoryType);
    }

    async removeWarning(providerId: number, providerCategoryId: string, categoryType: CategoryType) {
        return this.categoryMappingDAL.removeWarning(providerId, providerCategoryId, categoryType);
    }

    async getWarnings(page: number, limit: number) {
        return this.categoryMappingDAL.getWarnings(page, limit);
    }

    async getWarningsCount() {
        return this.categoryMappingDAL.getWarningsCount();
    }
}