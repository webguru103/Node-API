/**
 * Created by   on 3/4/2017.
 */
import { ICategoryMapping } from "../../components/category/interfaces/category.mapping.interface";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { CategoryStatus } from "../../../../CategoryService/src/components/category/enums/category_status.enum";

export interface ICategoryMappingService {
    addCategoryMapping(providerCategoryId: string, providerParentCategoryId: string, provierId: number,
        providerCategoryName: string, categoryType: CategoryType, providerSportId: string): Promise<number>;
    mapCategory(systemCategoryId: number, providerId: number,
        providerObjectsId: Array<string>, categoryType: CategoryType): Promise<ICategoryMapping[]>;
    appendMapCategory(systemCategoryId: number, providerId: number,
        providerObjectsId: Array<string>, categoryType: CategoryType): Promise<ICategoryMapping[]>;
    mergeCategories(systemOldCategoryId: number, systemNewCategoryId: number): Promise<any>;
    getMapping(providerId: number, providerCategoryId: string, categoryType: CategoryType): Promise<ICategoryMapping | undefined>;
    unMapCategory(systemCategoryId: number, providerId: number):Promise<any>;
    unMapProviderCategory(providerCategoryId: number, categoryType: CategoryType, providerId: number): Promise<any>;
    unMapCategoryForAllProviders(systemCategoryId: number):Promise<any>;
    getUnMappedCategoriesByProviderIdAndTypeId(providerId: number, categoryType: number): Promise<ICategoryMapping[]>;
    getCategoryMappingsByProviderId(systemCategoryId: number, providerId: number): Promise<ICategoryMapping[]>;
    getProviderLeaguesBySportId(provider_id: number, system_sport_id: number, mapped: boolean,
        status: CategoryStatus, page: number, limit: number): Promise<any[]>;
    update(category: ICategoryMapping): Promise<ICategoryMapping>;
    updateMany(categories: ICategoryMapping[]): Promise<ICategoryMapping[]>;
}