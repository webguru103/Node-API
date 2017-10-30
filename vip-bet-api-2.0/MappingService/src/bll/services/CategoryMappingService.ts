/**
 * Created by   on 3/4/2017.
 */
import { ICategoryMappingService } from "../abstract/ICategoryMappingService";
import { ICategoryMappingDAL } from "../../dal/abstract/ICategoryMappingDAL";
import { CategoryMappingDAL } from "../../dal/CategoryMappingDAL";
import { map } from "bluebird";
import { CommunicationCodes } from "../../../../CommonJS/src/messaging/CommunicationCodes";
import { ErrorUtil, ErrorCodes } from "../../../../CommonJS/src/messaging/ErrorCodes";
import { QueueType } from "../../../../CommonJS/src/messaging/QueueType";
import { ICategoryMapping } from "../../components/category/interfaces/category.mapping.interface";
import { CategoryMapping } from "../../components/category/models/category.mapping.model";
import { broker } from "../../../../CommonJS/src/base/base.model";
import { ICategory } from "../../../../CategoryService/src/components/category/interfaces/category.interface";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";
import { CategoryStatus } from "../../../../CategoryService/src/components/category/enums/category_status.enum";
import { defaultProvider } from "../../app";

export class CategoryMappingService implements ICategoryMappingService {
    private categoryMappingDAL: ICategoryMappingDAL = new CategoryMappingDAL();

    getUnMappedCategoriesByProviderIdAndTypeId(providerId: number, categoryType: number): Promise<ICategoryMapping[]> {
        return this.categoryMappingDAL.getUnMappedCategoriesByProviderIdAndTypeId(providerId, categoryType);
    }

    async addCategoryMapping(providerCategoryId: string, providerParentCategoryId: string, providerId: number,
        providerCategoryName: string, categoryType: CategoryType, providerSportId: string): Promise<number> {
        //if already mapped return map id
        const alreadyMapped = await this.getMapping(providerId, providerCategoryId, categoryType);
        if (alreadyMapped) return alreadyMapped.id;
        // add map
        const mapId = await this.categoryMappingDAL.addCategoryMapping(providerCategoryId, providerParentCategoryId, providerId,
            providerCategoryName, categoryType, providerSportId);
        // get default provider
        // const defaultProvider = await broker.sendRequest(CommunicationCodes.GET_DEFAULT_PROVIDER, {}, QueueType.COMMON_SERVICE);
        //if current provider is not default
        if (defaultProvider.value != providerId) return mapId;
        // get parent category type
        const parentCategoryType: CategoryType | undefined = this.getParentType(categoryType);
        // get parent mapping
        const parent = await this.getMapping(providerId, providerParentCategoryId, parentCategoryType);
        if (categoryType != CategoryType.SPORT && (!parent || !parent.system_category_id)) return mapId;
        //if current provider id default then save category
        const parentId = parent ? parent.system_category_id : null;
        const category: ICategory = await broker.sendRequest(CommunicationCodes.ADD_CATEGORY, {
            name: providerCategoryName,
            type_id: categoryType,
            parent_id: parentId
        }, QueueType.CATEGORY_SERVICE);
        // map category
        const categoryIds: string[] = [];
        categoryIds.push(providerCategoryId);
        await this.mapCategory(category.id, providerId, categoryIds, categoryType);
        return mapId;
    }

    async mapCategory(systemCategoryId: number, providerId: number, providerObjectsId: string[],
        categoryType: CategoryType): Promise<ICategoryMapping[]> {
        await this.unMapCategory(systemCategoryId, providerId);
        return this.appendMapCategory(systemCategoryId, providerId, providerObjectsId, categoryType);
    }

    async appendMapCategory(systemCategoryId: number, providerId: number, providerObjectsId: string[],
        categoryType: CategoryType): Promise<ICategoryMapping[]> {
        return map(providerObjectsId, async (providerCategoryId: string) => {
            const mapping = await this.categoryMappingDAL.mapCategory(systemCategoryId, providerId, providerCategoryId, categoryType);
            if (!mapping) throw ErrorUtil.newError(ErrorCodes.BAD_REQUEST);
            // delete category mapping warning
            broker.publishMessageWithCode(CommunicationCodes.DELETE_CATEGORY_WARNING, {
                provider_id: providerId,
                provider_category_id: providerCategoryId,
                category_type: categoryType
            }, QueueType.WARNINGS);
            return mapping;
        })
    }

    async getMapping(providerId: number, providerCategoryId?: string, providerCategoryType?: CategoryType): Promise<ICategoryMapping | undefined> {
        if (!providerCategoryId || !providerCategoryType) return;
        //get mapping
        const mapping = await this.categoryMappingDAL.getMapping(providerId, providerCategoryId, providerCategoryType);
        //if mapping exists but not mapped send notifications 
        if (mapping && !mapping.system_category_id) {
            const parentCategoryType: CategoryType | undefined = this.getParentType(providerCategoryType);
            const parentName = await this.getParentCategoryName(providerId, mapping.provider_parent_category_id, parentCategoryType, "");

            broker.publishMessageWithCode(CommunicationCodes.CATEGORY_NOT_MAPPED, {
                provider_id: providerId,
                provider_category_id: providerCategoryId,
                provider_category_name: mapping.provider_category_name,
                provider_parent_category_name: parentName,
                category_type: providerCategoryType
            }, QueueType.WARNINGS);
        }
        return mapping;
    }

    private async getParentCategoryName(providerId: number, providerCategoryId?: string,
        providerCategoryType?: CategoryType, outCategoryPath?: string): Promise<string | undefined> {
        if (!providerCategoryId || !providerCategoryType) return;
        if (!outCategoryPath) outCategoryPath = "";

        const mapping = await this.categoryMappingDAL.getMapping(providerId, providerCategoryId, providerCategoryType);
        outCategoryPath = mapping.provider_category_name + outCategoryPath;

        if (mapping.provider_parent_category_id) {
            outCategoryPath = "/" + outCategoryPath;
            const parentCategoryType: CategoryType | undefined = this.getParentType(providerCategoryType);
            return this.getParentCategoryName(providerId, mapping.provider_parent_category_id, parentCategoryType, outCategoryPath)
        } else {
            return outCategoryPath;
        }
    }

    async unMapCategory(systemCategoryId: number, providerId: number): Promise<any> {
        return this.categoryMappingDAL.unMapCategory(systemCategoryId, providerId);
    }

    async unMapProviderCategory(providerCategoryId: number, categoryType: CategoryType, providerId: number): Promise<any> {
        return this.categoryMappingDAL.unMapProviderCategory(providerCategoryId, categoryType, providerId);
    }

    async unMapCategoryForAllProviders(systemCategoryId: number): Promise<any> {
        return this.categoryMappingDAL.unMapCategoryForAllProviders(systemCategoryId);
    }

    async getCategoryMappingsByProviderId(systemCategoryId: number, providerId: number): Promise<ICategoryMapping[]> {
        return this.categoryMappingDAL.getCategoryMappingsByProviderId(systemCategoryId, providerId);
    }

    private getParentType(type: CategoryType): CategoryType | undefined {
        if (type == CategoryType.SPORT_COUNTRY) return CategoryType.SPORT;
        if (type == CategoryType.LEAGUE) return CategoryType.SPORT_COUNTRY;
        if (type == CategoryType.SUB_LEAGUE) return CategoryType.LEAGUE;
        return undefined;
    }

    async getProviderLeaguesBySportId(provider_id: number, system_sport_id: number, mapped: boolean,
        status: CategoryStatus, page: number, limit: number): Promise<any[]> {
        return this.categoryMappingDAL.getProviderLeaguesBySportId(provider_id, system_sport_id, mapped, status, page, limit);
    }

    async mergeCategories(systemOldCategoryId: number, systemNewCategoryId: number): Promise<any> {
        return this.categoryMappingDAL.mergeCategories(systemOldCategoryId, systemNewCategoryId);
    }

    async update(category: ICategoryMapping): Promise<ICategoryMapping> {
        const categoryMapping = new CategoryMapping(category);
        return categoryMapping.update();
    }

    async updateMany(categories: ICategoryMapping[]): Promise<ICategoryMapping[]> {
        return map(categories, async category => this.update(category));
    }
}