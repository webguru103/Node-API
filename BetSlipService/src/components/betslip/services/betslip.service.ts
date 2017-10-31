/**
 * Created by   on 3/9/2017.
 */
import { BetSlip } from "../models/betslip.model";
import { BetSlipFilter } from "../filters/betslip.filter";
import { IBetSlip } from "../interfaces/betslip.interface";
import { BetSlipType } from "../enums/betslip_type.enum";
import { ErrorUtil } from "../../../../../CommonJS/src/messaging/ErrorCodes";
import { isNotNumber } from "../../../../../CommonJS/src/utils/validators";

export class BetSlipService {
    async add(data: IBetSlip): Promise<any> {
        //place bet
        const betslip = new BetSlip(data);
        if (betslip.details.length > 1) betslip.type_id = BetSlipType.EXPRESS;
        else betslip.type_id = BetSlipType.SINGLE;
        return betslip.saveWithID();
    }

    async update(data: IBetSlip): Promise<IBetSlip> {
        if (isNotNumber(data.id)) throw ErrorUtil.newError(`betslip id is not provided`);
        const [betslip] = await new BetSlipFilter({ id: data.id }).find();
        if (!betslip) throw ErrorUtil.newError(`betslip ${data.id} not found`);
        return betslip.update(data);
    }

    async list(filter: Partial<BetSlipFilter>): Promise<(IBetSlip | undefined)[]> {
        return new BetSlipFilter(filter).find();
    }

    async get(filter: Partial<BetSlipFilter>): Promise<IBetSlip | undefined> {
        const [betslip] = await this.list(filter);
        return betslip;
    }
}