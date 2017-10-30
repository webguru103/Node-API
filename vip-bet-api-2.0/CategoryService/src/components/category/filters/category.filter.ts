import { DEFAULT_LANGUAGE } from "../../../../../CommonJS/src/domain/constant";
import { Category, CategoryPublic } from "../models/category.model";
import { QueryBuilder, BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { Translate } from "../../../../../CommonJS/src/components/translates/models/translate.model";
import { ICategoryPublic } from "../interfaces/category.interface";
import { toNumber, uniq } from 'lodash';
import { NormalizeOffset, NormalizeLimit } from "../../../../../CommonJS/src/utils/utils";
import { map } from "bluebird";
import { CategoryStatus } from "../enums/category_status.enum";
import { CategoryType } from "../enums/category_type.enum";

export class CategoryFilter {
    public id?: number;
    public ids?: number[];
    public name?: string;
    public lang_id?: number;
    public type_id?: CategoryType;
    public status_id?: CategoryStatus;
    public sport_id?: number;
    public parent_id?: number | null | undefined;
    public parent_type?: CategoryType;
    public include_parent_names?: boolean;
    public page: number;
    public limit: number;
    constructor(data: Partial<CategoryFilter>) {
        this.id = data.id;
        this.ids = data.ids;
        this.name = data.name;
        this.type_id = toNumber(data.type_id);
        this.lang_id = data.lang_id || DEFAULT_LANGUAGE;
        this.sport_id = toNumber(data.sport_id);
        this.parent_id = data.parent_id ? toNumber(data.parent_id) : data.parent_id;
        this.parent_type = data.parent_type;
        this.status_id = data.status_id
        // if status id provided as "" means all categories with all statuses should be provided
        if (this.status_id != null && this.status_id.toString() == "") this.status_id = undefined;
        if (this.parent_id != null && this.parent_id.toString() == "") this.parent_id = null;
        this.include_parent_names = data.include_parent_names;
        this.page = NormalizeOffset((data.page || 1) - 1);
        this.limit = NormalizeLimit(data.limit);
    }

    public async find(): Promise<ICategoryPublic[]> {
        const query = QueryBuilder(Category.tableName + " as cat")
            .join(Translate.tableName + " as tr", "tr.dict_id", "cat.dict_id")
            .leftJoin(Translate.tableName + " as tr2", QueryBuilder.raw(`tr2.dict_id = tr.dict_id and tr2.lang_id = ${this.lang_id}`))
            .where("tr.lang_id", DEFAULT_LANGUAGE)
            .orderBy('cat.order_id')
            .select('cat.*')
            .select(QueryBuilder.raw('coalesce(tr2.translation, tr.translation) as name'));
        if (this.parent_id) query.where("cat.parent_id", this.parent_id);
        if (this.parent_id === null && this.type_id != CategoryType.LEAGUE) query.whereRaw("cat.parent_id is null");
        if (this.type_id) query.where("cat.type_id", this.type_id);
        if (this.id) query.where("cat.id", this.id);
        if (this.ids) query.whereIn("cat.id", this.ids);
        if (this.status_id) query.where("cat.status_id", this.status_id);
        if (this.name) query.where(QueryBuilder.raw(`(lower(tr2.translation) ilike ? or lower(tr.translation) ilike ?)`, [this.name, this.name].map(n => "%" + n + "%")));
        if (this.sport_id && this.type_id === CategoryType.LEAGUE) {
            query.join(Category.tableName + " as countries", "cat.parent_id", "countries.id")
                .join(Category.tableName + " as sports", "countries.parent_id", "sports.id")
                .where("sports.id", this.sport_id)
        }
        const queryString = query.toString();
        const output = await BaseModel.db.manyOrNone(queryString);
        const categories = await map(output, async (c: any) => new CategoryPublic(c));

        if (this.include_parent_names && categories[0] && categories[0].type_id > CategoryType.SPORT) {
            const parents = await new CategoryFilter({ ids: uniq(categories.filter(c => c.parent_id !== undefined).map(c => <number>c.parent_id)), lang_id: this.lang_id }).find();
            await map(categories, async category => {
                const parent = parents.find(p => p.id === category.parent_id);
                if (parent) category.parent_name = parent.name;
            })
        }

        return categories;
    }
}