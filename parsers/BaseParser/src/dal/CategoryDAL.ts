/**
 * Created by   on 3/5/2017.
 */
import { ICategoryDAL } from "./abstract/ICategoryDAL";
import { isNullOrUndefined } from "util";
import { ServiceBase } from "../../../../CommonJS/src/bll/services/ServiceBase";
import { CategoryType } from "../../../../CategoryService/src/components/category/enums/category_type.enum";

export class CategoryDAL implements ICategoryDAL {
    addCategory(id: string, type: CategoryType, mapId: number, parentId: string, name: string) {
        let query = `insert into category(id, type_id, parent_id, map_id, name) values ($1, $2, $3, $4, $5) on conflict do nothing`;
        return ServiceBase.db.none(query, [id, type, parentId, mapId, name]);
    };

    isCategory(id: string, type: CategoryType) {
        let query = `select id from category
                        where id = $1
                        and type_id = $2`;
        return ServiceBase.db.oneOrNone(query, [id, type]).then(data => {
            return !isNullOrUndefined(data);
        });
    };
}