import { BaseModel } from "../../../../../CommonJS/src/base/base.model";
import { DEFAULT_LANGUAGE } from "../../../../../CommonJS/src/domain/constant";
import { Translate } from "../../../../../CommonJS/src/components/translates/models/translate.model";
import { merge } from "lodash";
import { ICategory, ICategoryPublic } from "../interfaces/category.interface";
import { CategoryStatus } from "../enums/category_status.enum";
import { CategoryType } from "../enums/category_type.enum";

export class Category extends BaseModel implements ICategory {
    public static tableName = "category";
    public id: number;
    public name?: string;
    public type_id: CategoryType;
    public dict_id?: number;
    public lang_id?: number;
    public parent_id?: number;
    public status_id?: CategoryStatus;
    public order_id?: number;
    public icon_url?: string;
    public icon_small_url?: string;

    constructor(data: ICategory) {
        super();
        this.id = data.id;
        this.name = data.name;
        this.type_id = data.type_id;
        this.dict_id = data.dict_id;
        this.lang_id = data.lang_id || DEFAULT_LANGUAGE;
        this.parent_id = data.parent_id;
        this.status_id = data.status_id;
        this.order_id = data.order_id;
        this.icon_url = data.icon_url;
        this.icon_small_url = data.icon_small_url;
    }

    public async saveWithID(): Promise<Category> {
        const translate = new Translate(<any>{ lang_id: this.lang_id, translation: this.name });
        await translate.saveWithID();

        let langId = this.lang_id;
        delete this.lang_id;
        delete this.name;
        this.dict_id = <number>translate.dict_id;

        await super.saveWithID();
        this.order_id = this.id;
        await super.update();

        this.lang_id = langId;
        this.name = translate.translation;
        return this;
    }

    public static async findOne(data: any): Promise<Category | undefined> {
        let category = await super.findOne(<any>Category, { id: data.id });
        if (!category) return;
        let translate = <Translate>await Translate.findOne(<any>Translate, { dict_id: category.dict_id, lang_id: data.lang_id || DEFAULT_LANGUAGE });
        category.name = translate.translation;
        return new Category(category);
    }

    public async update(data: any, byFields: any = { id: this.id }): Promise<Category> {
        merge(this, data);
        let langId = this.lang_id;
        let name = this.name;
        delete this.lang_id;
        delete this.name;
        await super.update();
        await Translate.update(<any>Translate, { translation: name }, { dict_id: this.dict_id, lang_id: langId });
        return this;
    }

    public static async updateOrder(id: number, categoryTypeId: CategoryType, parentCategoryId: number, step: number, direction: number): Promise<any> {
        let query: string = "";
        if (direction < 0) {
            //when category moves up
            query = `DO $$
                        DECLARE 
                            cat_order_id integer;
                            min_order_id integer;
                            cat_id integer = $1;
                            cat_type_id integer = $2;
                            step integer = $3;
                    BEGIN
                        SELECT order_id INTO cat_order_id FROM category WHERE id = cat_id;
                        CREATE TEMP TABLE tmp_table ON COMMIT DROP AS
                            SELECT id, order_id from category
                            WHERE order_id < cat_order_id
                            AND type_id = cat_type_id
                            AND ($4 is null OR parent_id = $4)
                            ORDER BY order_id DESC
                            LIMIT step;
                            
                        SELECT MIN(order_id) INTO min_order_id FROM tmp_table;
                        
                        UPDATE category cat
                        SET order_id = min_order_id
                        WHERE cat.id = cat_id;
                    END $$;
                    
                    UPDATE category cat
                    SET order_id = cat.order_id + 1
                    FROM tmp_table
                    WHERE tmp_table.id = cat.id;`
        } else if (direction > 0) {
            //when category moves down
            query = `DO $$
                        DECLARE 
                            cat_order_id integer;
                            max_order_id integer;
                            cat_id integer = $1;
                            cat_type_id integer = $2;
                            step integer = $3;

                    BEGIN
                        SELECT order_id INTO cat_order_id FROM category WHERE id = cat_id;
                        CREATE TEMP TABLE tmp_table ON COMMIT DROP AS
                            SELECT id, order_id from category
                            WHERE order_id > cat_order_id
                            AND type_id = cat_type_id
                            AND ($4 is null OR parent_id = $4)
                            ORDER BY order_id
                            LIMIT step;
                            
                        SELECT MAX(order_id) INTO max_order_id FROM tmp_table;
                        
                        UPDATE category cat
                        SET order_id = max_order_id
                        WHERE cat.id = cat_id;
                    END $$;
                    
                    UPDATE category cat
                    SET order_id = cat.order_id - 1
                    FROM tmp_table
                    WHERE tmp_table.id = cat.id;`
        }
        return BaseModel.oneOrNone(query, [id, categoryTypeId, step, parentCategoryId]);
    }
}

export class CategoryPublic extends BaseModel implements ICategoryPublic {
    public id: number;
    public name: string;
    public type_id: CategoryType;
    public dict_id?: number;
    public lang_id?: number;
    public parent_id?: number;
    public parent_name?: string;
    public status_id?: CategoryStatus;
    public order_id?: CategoryType;
    public icon_url?: string;
    public icon_small_url?: string;
    public events_count?: number;

    constructor(data: ICategoryPublic) {
        super();
        this.id = data.id;
        this.name = data.name;
        this.type_id = data.type_id;
        this.dict_id = data.dict_id;
        this.lang_id = data.lang_id || DEFAULT_LANGUAGE;
        this.parent_id = data.parent_id;
        this.parent_name = data.parent_name;
        this.status_id = data.status_id;
        this.order_id = data.order_id;
        this.icon_url = data.icon_url;
        this.icon_small_url = data.icon_small_url;
        this.events_count = data.events_count;
    }
}