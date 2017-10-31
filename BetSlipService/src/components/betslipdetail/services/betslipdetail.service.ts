import { IBetSlipDetail } from "../interfaces/betslip.detail.interface";
import { BetSlipDetailFilter } from "../filters/betslip.detail.filter";
import { ISelectionResult } from "../../../../../MarketService/src/components/selections/interfaces/selection_result.interface"
import { map, reduce } from "bluebird";
import { ErrorUtil } from "../../../../../CommonJS/src/messaging/ErrorCodes";
import { BetSlipFilter } from "../../betslip/filters/betslip.filter";
import { uniq } from "lodash";
import { isNotNumber } from "../../../../../CommonJS/src/utils/validators";
import { IBetSlip } from "../../betslip/interfaces/betslip.interface";

export class BetSlipDetailService {
    async update(data: IBetSlipDetail): Promise<IBetSlipDetail> {
        if (isNotNumber(data.id)) throw ErrorUtil.newError(`betslipDetail.id not number`);
        // find detail and update
        const [betslipDetail] = await new BetSlipDetailFilter({ id: data.id }).find();
        if (!betslipDetail) throw ErrorUtil.newError(`betslip detail ${data.id} not found`);
        await betslipDetail.update(data);
        // find betslip and update
        const [betslip] = await new BetSlipFilter({ id: betslipDetail.betslip_id }).find();
        if (!betslip) throw ErrorUtil.newError(`betslip ${betslipDetail.betslip_id} not found`);
        return betslip.update();
    }

    async get(filter: Partial<BetSlipDetailFilter>): Promise<IBetSlipDetail | undefined> {
        const [detail] = await this.list(filter);
        return detail;
    }

    async list(filter: Partial<BetSlipDetailFilter>): Promise<IBetSlipDetail[]> {
        const detailFilter = new BetSlipDetailFilter(filter);
        return await detailFilter.find();
    }

    async updateResult(results: ISelectionResult[]): Promise<IBetSlip[]> {
        // get betslip details for provided selections results
        let betslipDetails = await this.list({ event_selection_ids: results.map(r => r.id) });
        if (betslipDetails.length == 0) return [];
        // betslip details which was updated
        betslipDetails = await reduce(betslipDetails, async (result: IBetSlipDetail[], detail: IBetSlipDetail) => {
            // result
            const selectionResult = results.find(d => d.id === detail.event_selection_id);
            // if detail not found return
            if (selectionResult === undefined) return result;
            // if result does not changed
            if (selectionResult.result_type_id === detail.result_type_id) return result;
            // set retult
            detail.result_type_id = selectionResult.result_type_id;
            // update betslip detail and include detail to result
            return result.concat(await detail.update());
        }, []);
        // betslip ids
        const betslipIds = uniq(await map(betslipDetails, async detail => detail.betslip_id));
        const betslips = await new BetSlipFilter({ ids: betslipIds }).find();
        // update betslips
        return map(betslips, async betslip => betslip.update());
    }
}