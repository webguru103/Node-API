/**
 * Created by   on 3/4/2017.
 */
import { ICategoryMapping } from "../../components/category/interfaces/category.mapping.interface";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { CategoryStatus } from "../../../../CategoryService/src/components/category/enums/category_status.enum";

export interface ICategoryMappingDAL {
    addCategoryMapping(providerCategoryId: string, providerParentCategoryId: string, providerId: number, providerCategoryName: string, categoryType: CategoryType, providerSportId: string): Promise<number>;
    getMapping(providerId: number, providerCategoryId: string, categoryType: CategoryType): Promise<ICategoryMapping>;
    getMappingByName(categoryType: CategoryType, categoryName: string): Promise<any | undefined>;
    mapCategory(systemCategoryId: number, providerId: number, providerCategoryId: string, categoryType: CategoryType): Promise<ICategoryMapping>;
    mergeCategories(systemOldCategoryId: number, systemNewCategoryId: number): Promise<any>;
    unMapCategory(systemCategoryId: number, providerId: number);
    unMapProviderCategory(providerCategoryId: number, categoryType: CategoryType, providerId: number): Promise<any>;
    unMapCategoryForAllProviders(systemCategoryId: number);
    getUnMappedCategoriesByProviderIdAndTypeId(providerId: number, categoryType: CategoryType): Promise<ICategoryMapping[]>;
    getCategoryMappingsByProviderId(systemCategoryId: number, providerId: number);
    getProviderLeaguesBySportId(provider_id: number, system_sport_id: number, mapped: boolean, status: CategoryStatus, page: number, limit: number): Promise<any[]>;
}