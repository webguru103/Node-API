/**
 * Created by   on 3/1/2017.
 */
import { CommunicationCodes } from "../../../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../../../CommonJS/src/messaging/QueueType";
import { Category, CategoryPublic } from "../../../components/category/models/category.model";
import { broker } from "../../../../../CommonJS/src/base/base.model";
import { ErrorCodes, ErrorUtil } from "../../../../../CommonJS/src/messaging/ErrorCodes";
import { map } from "bluebird";
import { isNumber } from "lodash";
import { CategoryFilter } from "../filters/category.filter";
import { ICategory, ICategoryPublic } from "../interfaces/category.interface";
import { CategoryType } from "../enums/category_type.enum";

export class CategoryService {
    async add(data: ICategory): Promise<ICategory> {
        if (!data.name || !data.type_id) throw ErrorUtil.newError("required fields are missing");
        // find exising category
        let [category] = await new CategoryFilter(data).find();
        // if category found
        if (category) return category;
        // create new category
        return new Category(data).saveWithID();
    }

    async get(filter: CategoryFilter): Promise<ICategoryPublic> {
        const [category] = await this.list(filter);
        return category;
    }

    async list(filter: CategoryFilter): Promise<ICategoryPublic[]> {
        return new CategoryFilter(filter).find();
    }

    async update(data: ICategory): Promise<ICategory> {
        const category = <Category | undefined>await Category.findOne(<any>{ id: data.id })
        //if category not found return
        if (!category) throw ErrorUtil.newError(ErrorCodes.CATEGORY_DOES_NOT_EXISTS);
        //if category status has been changed store that
        const updateCategoryStatus = data.status_id && data.status_id != category.status_id;
        //update category
        await category.update(data);
        //update category status in event service
        if (updateCategoryStatus) await broker.sendRequest(CommunicationCodes.UPDATE_EVENTS_CATEGORY_STATUS, category, QueueType.EVENT_SERVICE);
        //return updated category
        return category;
    }

    async delete(id: number, joinWith?: number): Promise<any> {
        if (!isNumber(id)) throw ErrorUtil.newError("category id not number");
        if (joinWith && !isNumber(joinWith)) throw ErrorUtil.newError("joinWith is not number");
        // find category
        const category = await this.get(<any>{ id: id });
        if (!category) throw ErrorUtil.newError("category not found");
        // if join provided join category
        if (joinWith) {
            await broker.sendRequest(
                CommunicationCodes.MERGE_CATEGORIES, {
                    system_old_category_id: id,
                    system_new_category_id: joinWith
                },
                QueueType.MAPPING_SERVICE);
        } else {
            await broker.sendRequest(
                CommunicationCodes.UN_MAP_CATEGORY_FOR_ALL_PROVIDERS, {
                    system_category_id: id
                },
                QueueType.MAPPING_SERVICE);
        }
        // move events to join category if join is league if not delete all
        if (joinWith && category.type_id == CategoryType.LEAGUE) {
            const leagueToJoinWith = <Category>await Category.findOne({ id: joinWith });
            await broker.sendRequest(CommunicationCodes.MOVE_EVENTS_TO_LEAGUE, {
                from: category.id,
                to: joinWith,
                to_parent: leagueToJoinWith.parent_id
            }, QueueType.EVENT_SERVICE);
        } else {
            let code = CommunicationCodes.DELETE_LEAGUE_EVENTS;
            if (category.type_id == CategoryType.SPORT) code = CommunicationCodes.DELETE_SPORT_EVENTS;
            if (category.type_id == CategoryType.SPORT_COUNTRY) code = CommunicationCodes.DELETE_COUNTRY_EVENTS;
            await broker.sendRequest(code, { id: id }, QueueType.EVENT_SERVICE);
        }
        // delete category
        await new Category(category).delete();
    }

    async updateOrder(id: number, categoryTypeId: CategoryType, parentCategoryId: number, step: number, direction: number) {
        return Category.updateOrder(id, categoryTypeId, parentCategoryId, step, direction);
    }

    // get categories with event count 
    async getByTimeRange(filter: CategoryFilter): Promise<ICategoryPublic[]> {
        // wrap filter
        filter = new CategoryFilter(filter);
        // get events counts for categories
        const eventCategories = await broker.sendRequest(CommunicationCodes.GET_EVENTS_CATEGORIES_BY_TIME, filter, QueueType.EVENT_SERVICE);
        // get all categories
        const categories = await this.list(filter);
        // convert them into public categories
        const categoriesPublic = categories.map(c => new CategoryPublic(c));
        // update events count in public models
        await map(categoriesPublic, category => {
            const eventCategory = eventCategories.find(ec => ec.id == category.id);
            if (eventCategory) category.events_count = eventCategory.count;
            else category.events_count = 0;
        })
        // return public models
        return categoriesPublic;
    }
}