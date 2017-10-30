import { StatisticTypeFilter } from "../filters/statistic_type.filter";
import { StatisticType } from "../models/statistic_type.model";
import { IStatisticType } from "../interfaces/statistic_type.interface";
import { map } from "bluebird";

export class StatisticTypeService {
    async add(data: IStatisticType): Promise<IStatisticType> {
        // find exising StatisticType
        const filter = await new StatisticTypeFilter(data);
        filter.name_exact = true;
        const [statsType] = await filter.find();
        // if StatisticType found
        if (statsType) return statsType.update(data);
        // create new StatisticType
        return new StatisticType(data).saveWithID();
    }

    async get(filter: Partial<StatisticTypeFilter>): Promise<IStatisticType> {
        const [statsType] = await this.list(filter);
        return statsType;
    }

    async list(filter: Partial<StatisticTypeFilter>): Promise<IStatisticType[]> {
        return new StatisticTypeFilter(filter).find();
    }

    async update(data: IStatisticType): Promise<IStatisticType | undefined> {
        const statsType = <StatisticType | undefined>await StatisticType.findOne(<any>StatisticType, { id: data.id })
        // if scope does not found return
        if (!statsType) return;
        // update scope
        return new StatisticType(statsType).update(data);
    }

    async updateMany(data: IStatisticType[]): Promise<(IStatisticType | undefined)[]> {
        return map(data, stype => this.update(stype));
    }

    async delete(data: IStatisticType): Promise<any> {
        return StatisticType.delete(<any>StatisticType, data);
    }
}