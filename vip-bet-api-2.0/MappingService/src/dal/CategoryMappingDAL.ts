/**
 * Created by   on 3/4/2017.
 */
import { ICategoryMappingDAL } from "./abstract/ICategoryMappingDAL";
import { NormalizeLimit, NormalizeOffset } from "../../../CommonJS/src/utils/utils";
import { BaseModel, QueryBuilder } from "../../../CommonJS/src/base/base.model";
import { ICategoryMapping } from "../components/category/interfaces/category.mapping.interface";
import { CategoryType } from "../../../CategoryService/src/components/category/enums/category_type.enum";
import { CategoryStatus } from "../../../CategoryService/src/components/category/enums/category_status.enum";

export class CategoryMappingDAL implements ICategoryMappingDAL {
    async addCategoryMapping(providerCategoryId: string, providerParentCategoryId: string, providerId: number, providerCategoryName: string, categoryType: CategoryType, providerSportId: string) {
        let query = `insert into category_mapping (provider_id, provider_category_id, provider_parent_category_id, system_category_id, provider_category_name, category_type, provider_sport_id)  values ($1, $2, $3, $4, $5, $6, $7)
                         on conflict ("provider_id", "provider_category_id", "category_type") do update set provider_sport_id = $7 RETURNING id;`;
        let data = await BaseModel.db.one(query, [providerId, providerCategoryId.toString(), providerParentCategoryId, null, providerCategoryName, categoryType, providerSportId]);
        return data.id;
    }

    async getMapping(providerId: number, providerCategoryId: string, categoryType: CategoryType): Promise<any | undefined> {
        if (!providerCategoryId) return;
        let query = `select id, system_category_id, provider_parent_category_id, provider_category_name from category_mapping
                     where provider_id = $1
                     and provider_category_id = $2
                     and category_type = $3;`;
        return BaseModel.oneOrNone(query, [providerId, providerCategoryId.toString(), categoryType]);
    }

    async getMappingByName(categoryType: CategoryType, categoryName: string): Promise<any | undefined> {
        let query = `select id, system_category_id from category_mapping
                     where category_type = $1
                     and provider_category_name = $2
                     and system_category_id is not null`;
        return BaseModel.db.any(query, [categoryType, categoryName]);
    }

    async mapCategory(systemCategoryId: number, providerId: number, providerCategoryId: string, categoryType: CategoryType): Promise<ICategoryMapping> {
        let query = `update category_mapping
                     set system_category_id = $3
                     where provider_id = $1
                     and provider_category_id = $2
                     and category_type = $4
                     returning *`;
        return BaseModel.oneOrNone(query, [providerId, providerCategoryId.toString(), systemCategoryId, categoryType]);
    }

    async unMapCategory(systemCategoryId: number, providerId: number) {
        let query = `update category_mapping 
                        set system_category_id = null
                        where provider_id = $1
                        and system_category_id = $2`;
        return BaseModel.none(query, [providerId, systemCategoryId]);
    }

    async unMapProviderCategory(providerCategoryId: number, categoryType: CategoryType, providerId: number) {
        let query = `update category_mapping 
                        set system_category_id = null
                        where provider_id = $1
                        and provider_category_id = $2
                        and category_type = $3`;
        return BaseModel.none(query, [providerId, providerCategoryId, categoryType]);
    }

    async unMapCategoryForAllProviders(systemCategoryId: number) {
        let query = `update category_mapping 
                        set system_category_id = null
                        where system_category_id = $1`;
        return BaseModel.none(query, [systemCategoryId]);
    }

    async getUnMappedCategoriesByProviderIdAndTypeId(providerId: number, categoryType: number): Promise<ICategoryMapping[]> {
        let query = `select id,
                            provider_category_id,
                            provider_category_name,
                            system_category_id
                        from category_mapping 
                        where provider_id = $1
                        and category_type = $2
                        and system_category_id is null`;
        return BaseModel.manyOrNone(query, [providerId, categoryType]);
    }

    async getCategoryMappingsByProviderId(systemCategoryId: number, providerId: number): Promise<ICategoryMapping[]> {
        let query = `select * from category_mapping 
                        where system_category_id = $1
                        and provider_id = $2`;
        return BaseModel.manyOrNone(query, [systemCategoryId, providerId]);
    }

    async getProviderLeaguesBySportId(provider_id: number, system_sport_id: number, mapped: boolean, status: CategoryStatus, page: number, limit: number): Promise<any[]> {
        let query = QueryBuilder("category_mapping as cat1")
            .join("category_mapping as cat2", function () {
                this.on("cat1.provider_sport_id", "cat2.provider_category_id")
                    .andOn("cat1.provider_id", "cat2.provider_id")
            })
            .leftJoin("category_mapping as cat3", function () {
                this.on("cat1.provider_parent_category_id", "cat3.provider_category_id")
                    .andOn("cat1.provider_id", "cat3.provider_id")
            })
            .where("cat2.system_category_id", system_sport_id)
            .andWhere("cat1.provider_id", provider_id)
            .andWhere("cat1.category_type", CategoryType.LEAGUE)
            .andWhere("cat3.category_type", CategoryType.SPORT_COUNTRY)
            .limit(NormalizeLimit(limit))
            .offset(NormalizeOffset((page - 1) * NormalizeLimit(limit)))
            .select(
            "cat1.id",
            "cat1.system_category_id",
            "cat1.provider_category_id",
            "cat1.provider_category_name",
            "cat1.provider_category_status_id",
            "cat1.provider_id",
            "cat3.provider_category_name as parent_category_name",
            QueryBuilder.raw("count(cat1.*) OVER() AS full_count"),
            QueryBuilder.raw("concat(cat3.provider_category_name,'/',cat1.provider_category_name) as name"))
            .orderBy("cat3.provider_category_name")
            .orderBy("cat1.provider_category_name");

        if (mapped !== undefined && mapped == false) {
            query.whereNull("cat1.system_category_id");
        } else if (mapped !== undefined && mapped == true) {
            query.whereNotNull("cat1.system_category_id");
        }

        // show hidded leagues or active leagues
        if (status) {
            query.where("cat1.provider_category_status_id", status)
        }

        let queryString = query.toString();

        return BaseModel.manyOrNone(queryString);
    }

    async mergeCategories(systemOldCategoryId: number, systemNewCategoryId: number): Promise<any> {
        let query = `update category_mapping 
                        set system_category_id = $2
                        where system_category_id = $1`;
        return BaseModel.none(query, [systemOldCategoryId, systemNewCategoryId]);
    }
}