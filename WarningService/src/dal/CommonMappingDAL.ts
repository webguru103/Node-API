import {ICommonMappingDAL} from "./abstract/IComonMappingDAL";
import { ServiceBase } from "../../../CommonJS/src/bll/services/ServiceBase";
/**
 * Created by   on 3/27/2017.
 */

export class CommonMappingDAL implements ICommonMappingDAL {
    async getWarningsCount() {
        let query = `select ((select count(id) from category_mapping)
                       + (select count(id) from participant_mapping)
                       + (select count(id) from market_mapping)
                       + (select count(id) from selection_mapping)) as total_count;`;

        return ServiceBase.db.oneOrNone(query, []);
    }
}