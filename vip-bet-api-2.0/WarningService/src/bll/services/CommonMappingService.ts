/**
 * Created by   on 3/27/2017.
 */
import { ICommonMappingService } from "../abstract/ICommonMappingService";
import { ICommonMappingDAL } from "../../dal/abstract/IComonMappingDAL";
import { CommonMappingDAL } from "../../dal/CommonMappingDAL";

export class CommonMappingService implements ICommonMappingService {
    private commonMappingDAL: ICommonMappingDAL = new CommonMappingDAL();

    async getWarningsCount() {
        return this.commonMappingDAL.getWarningsCount();
    }
}