/**
 * Created by   on 3/5/2017.
 */
import { ICategoryService } from "../abstract/ICategoryService";
import { ServiceBase, broker } from "../../../../../CommonJS/src/bll/services/ServiceBase";
import { ICategoryDAL } from "../../dal/abstract/ICategoryDAL";
import { CategoryDAL } from "../../dal/CategoryDAL";
import { CommunicationCodes } from "../../../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../../../CommonJS/src/messaging/QueueType";
import { CategoryType } from "../../../../../CategoryService/src/components/category/enums/category_type.enum";

export class CategoryService extends ServiceBase implements ICategoryService {
    private categoryDAL: ICategoryDAL = new CategoryDAL();

    async addCategory(id: string, type: CategoryType, parentId: string | undefined, name: string, sportId?: string): Promise<any> {
        parentId = parentId ? parentId.toString() : parentId;
        sportId = sportId ? sportId.toString() : sportId;
        id = id.toString();

        let mapId = await broker.sendRequest(
            CommunicationCodes.ADD_CATEGORY_MAPPING, {
                providerCategoryId: id.toString(),
                providerParentCategoryId: parentId ? parentId.toString() : parentId,
                providerCategoryName: name,
                categoryType: type,
                providerSportId: sportId ? sportId.toString() : sportId,
                providerId: ServiceBase.providerId
            },
            QueueType.MAPPING_SERVICE);
        if (isNaN(Number(mapId))) return;
        return this.categoryDAL.addCategory(id, type, mapId, parentId, name);
    }

    isCategory(id: string, type: CategoryType) {
        return this.categoryDAL.isCategory(id, type);
    }
}