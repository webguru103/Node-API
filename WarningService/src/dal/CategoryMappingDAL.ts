/**
 * Created by   on 3/27/2017.
 */
import { ICategoryMappingDAL } from "./abstract/ICategoryMappingDAL";
import { ServiceBase } from "../../../CommonJS/src/bll/services/ServiceBase";
import { CategoryType } from "../../../CategoryService/src/components/category/enums/category_type.enum";

export class CategoryMappingDAL implements ICategoryMappingDAL {
    async addWarning(providerId: number, providerCategoryId: string, providerCategoryName: string, providerParentCategoryName: string, categoryType: CategoryType) {
        let query = `insert into category_mapping(  provider_id, 
                                                    provider_category_id, 
                                                    provider_category_name,
                                                    provider_parent_category_name,
                                                    category_type)  values ($1, $2, $3, $4, $5)
                      on conflict("provider_id", "provider_category_id", "category_type") do update set provider_category_name=$3 RETURNING id;`;
        let data = await ServiceBase.db.one(query, [providerId.toString(), providerCategoryId, providerCategoryName, providerParentCategoryName, categoryType]);
        return data.id;
    }

    async removeWarning(providerId: number, providerCategoryId: string, categoryType: CategoryType) {
        let query = `delete from category_mapping where provider_id = $1 and provider_category_id = $2 and category_type = $3;`;
        return ServiceBase.db.none(query, [providerId.toString(), providerCategoryId, categoryType]);
    }

    async getWarnings(page: number, limit: number) {
        let query = `select cm.*, count(cm.*) OVER() AS full_count, p.name as provider_name from category_mapping as cm, provider p
                        where p.id = cm.provider_id
                        order by cm.provider_id, cm.provider_parent_category_name, cm.provider_category_id
                        limit $2
                        offset $1;`;
        return ServiceBase.db.manyOrNone(query, [page, limit]);
    }

    async getWarningsCount() {
        let query = `select count(*) from category_mapping`;
        return ServiceBase.db.oneOrNone(query, []);
    }
}