import { NormalizeOffset, NormalizeLimit } from "../../../../../CommonJS/src/utils/utils";
import { IParticipantMapping } from "../interfaces/participant.mapping.interface";
import { QueryBuilder, BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { ParticipantMapping } from "../models/participant.mapping.model";
import { CategoryMapping } from "../../category/models/category.mapping.model";
import { CategoryStatus } from "../../../../../CategoryService/src/components/category/enums/category_status.enum";
import { isString } from "lodash";

export class ProviderParticipantFilter {
    public provider_id?: number;
    public sport_id?: number;
    public unmapped?: boolean;
    public name?: string;
    public page: number;
    public limit: number;

    constructor(filter: Partial<ProviderParticipantFilter>) {
        this.provider_id = filter.provider_id;
        this.sport_id = filter.sport_id;
        this.unmapped = isString(filter.unmapped) ? JSON.parse(filter.unmapped) : filter.unmapped;
        if (this.unmapped === undefined) this.unmapped = false;
        this.name = filter.name;
        this.page = NormalizeOffset((filter.page || 1) - 1);
        this.limit = NormalizeLimit(filter.limit);
    }

    async find(): Promise<IParticipantMapping[]> {
        let query = QueryBuilder(ParticipantMapping.tableName)
            .join(`${CategoryMapping.tableName} as cat_map_1`, function () {
                this.on(`${ParticipantMapping.tableName}.provider_sport_id`, "cat_map_1.provider_category_id")
                    .andOn(`${ParticipantMapping.tableName}.provider_id`, "cat_map_1.provider_id")
            })
            .join(`${CategoryMapping.tableName} as cat_map_2`, function () {
                this.on(`${ParticipantMapping.tableName}.provider_league_id`, "cat_map_2.provider_category_id")
                    .andOn(`${ParticipantMapping.tableName}.provider_id`, "cat_map_2.provider_id")
            })
            .select(`${ParticipantMapping.tableName}.id`)
            .select(`${ParticipantMapping.tableName}.system_participant_id`)
            .select(`${ParticipantMapping.tableName}.provider_id`)
            .select(QueryBuilder.raw(`concat(cat_map_2.provider_category_name, '/', ${ParticipantMapping.tableName}.provider_participant_name) as provider_participant_name`))
            .select(QueryBuilder.raw(`count(${ParticipantMapping.tableName}.*) OVER() AS full_count`))
            .where("cat_map_2.provider_category_status_id", CategoryStatus.ACTIVE)
            .orderBy("cat_map_2.provider_category_name")
            .orderBy(`${ParticipantMapping.tableName}.provider_participant_name`)
            .limit(NormalizeLimit(this.limit))
            .offset(NormalizeOffset(this.page * this.limit))

        if (this.name) query.where(`${ParticipantMapping.tableName}.provider_participant_name) ilike '%${this.name}%'`)
        if (this.sport_id) query.where("cat_map_1.system_category_id", this.sport_id)
        if (this.provider_id) query.where(`${ParticipantMapping.tableName}.provider_id`, this.provider_id)
        if (this.unmapped) query.whereNull(`${ParticipantMapping.tableName}.system_participant_id`);

        return BaseModel.manyOrNone(query.toString());
    }
}