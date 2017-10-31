import * as knex from 'knex';
import { BrokerUtil } from "../messaging/BrokerUtil";
import { IMessageBroker } from "../messaging/IMessageBroker";
import { CleanObject, NormalizeLimit, NormalizeOffset } from "../utils/utils";
import { merge } from "lodash";
import { IBase } from "./base.interface";

export const QueryBuilder = knex({ dialect: 'pg' });
export const broker: IMessageBroker = BrokerUtil.getBroker();

type RangeType = string | number | boolean | Date | Array<string> | Array<number> | Array<Date> | Array<boolean> | Buffer | knex.Raw;

export class BaseModel implements IBase {
    public static db: any;
    public static tableName = '';
    public get tableName(): string {
        return (<any>this.constructor).tableName
    }
    public id?: number;

    public static async saveWithID(model: BaseModel, data: any, conflictRule?: string): Promise<number> {
        CleanObject(data);
        let query = QueryBuilder.table(model.tableName).insert(data).toString();
        if (conflictRule) {
            query += " " + conflictRule;
        }
        query += " returning id;";
        try {
            const returnData = await BaseModel.db.one(query);
            return Number(returnData.id);
        } catch (ex) {
            console.error(ex);
            throw ex;
        }
    }

    public static async manyOrNone(query, params?: any): Promise<any[]> {
        return BaseModel.db.manyOrNone(query, params);
    }

    public static async oneOrNone(query, params?: any): Promise<any> {
        return BaseModel.db.oneOrNone(query, params)
    }

    public static async none(query, params?: any): Promise<void> {
        return BaseModel.db.none(query, params);
    }

    public async save(conflictRule?: string): Promise<any> {
        return await BaseModel.save(this, this, conflictRule);
    }

    public static async save(model: BaseModel, data: any, conflictRule?: string): Promise<BaseModel | undefined> {
        let query = QueryBuilder.table(model.tableName).insert(data).toString();
        if (conflictRule) {
            query += " " + conflictRule;
        }
        query += " returning *;";

        return await BaseModel.db.one(query);
    }

    public async saveWithID(conflictRule?: string): Promise<any> {
        this.id = await BaseModel.saveWithID(this, this, conflictRule);;
        return this;
    }

    public static async update(model: BaseModel, data: any, byFields: object = { "id": data.id }): Promise<any> {
        const fields = Object.assign({}, data);
        delete fields.id;
        CleanObject(fields);
        if (Object.keys(fields).length == 0) return;
        const query = QueryBuilder.table(model.tableName).update(fields, "*").where(byFields).toString();
        return BaseModel.db.oneOrNone(query);
    }

    public async update(data: any = this, byFields: any = { id: this.id }): Promise<any> {
        merge(this, data);
        return BaseModel.update(this, this, byFields);
    }

    public static async delete(model: BaseModel, byFields: any): Promise<any> {
        CleanObject(byFields);
        if (Object.keys(byFields).length == 0) return;
        let query = QueryBuilder.table(model.tableName).where(byFields).delete().toString();
        return BaseModel.db.none(query);
    }

    public async delete(byFields: any = { id: this.id }): Promise<any> {
        return BaseModel.delete(this, byFields);
    }

    public static async deleteMany(model: BaseModel, filterInField: string, filterIn: any[]): Promise<any> {
        let query = QueryBuilder.table(model.tableName).whereIn(filterInField, filterIn).delete().returning('id').toString();
        return BaseModel.db.manyOrNone(query);
    }

    public async deleteMany(filterInField: string, filterIn: any[]): Promise<any> {
        return BaseModel.deleteMany(this, filterInField, filterIn);
    }

    public async findOne(fields: any): Promise<any | undefined> {
        return BaseModel.findOne(this, fields);
    }

    public static async findOne(model: BaseModel, fields: any): Promise<any | undefined> {
        CleanObject(fields);
        if (Object.keys(fields).length === 0) return;
        const query = QueryBuilder.table(model.tableName).select("*").where(fields).toString();
        return BaseModel.db.oneOrNone(query);
    }

    public async findMany(filter: any, filterInField: string | undefined = undefined, filterIn: any[] | undefined = undefined, page: number = 1, limit: number = 100): Promise<any[] | undefined> {
        return BaseModel.findMany(this, filter, filterInField, filterIn, page, limit);
    }

    public static async findMany(model: BaseModel, filter: any, filterInField: string | undefined = undefined, filterIn: any[] | undefined = undefined, page: number = 1, limit: number = 100, disableLimit: boolean = false, orderBy = "id"): Promise<any[]> {
        CleanObject(filter);
        let query = QueryBuilder.table(model.tableName);
        if (filterIn && filterInField) {
            query.whereIn(filterInField, filterIn)
                .andWhere(filter);
        } else {
            query.where(filter);
        }

        query.orderBy(orderBy, 'desc');

        if (!disableLimit) {
            query.limit(NormalizeLimit(limit))
                .offset(NormalizeOffset(page - 1) * NormalizeLimit(limit));
        }

        const queryString = query.toString();
        return BaseModel.db.manyOrNone(queryString);
    }

    public async findManyBetween(filter: any, dateField: string, range: [RangeType, RangeType], page: number = 1, limit: number = 100): Promise<any[]> {
        return BaseModel.findMany(this, filter, dateField, range, page, limit);
    }

    public static async findManyBetween(model: BaseModel, filter: any, dateField: string, range: [RangeType, RangeType], page: number = 1, limit: number = 100, disableLimit: boolean = false): Promise<any[]> {
        CleanObject(filter);
        const filterCopy = Object.assign({}, filter);
        delete filterCopy.range;
        delete filterCopy.page;
        delete filterCopy.limit;
        delete filterCopy.date_from;
        delete filterCopy.date_to;
        delete filterCopy.lang_id;

        let query = QueryBuilder.table(model.tableName);
        if (range && range.length > 0) {
            query.whereBetween(dateField, range)
                .andWhere(filterCopy);
        } else {
            query.where(filterCopy);
        }
        query.orderBy('id', 'desc')

        if (!disableLimit) {
            query.limit(NormalizeLimit(limit))
                .offset(NormalizeOffset(page - 1) * NormalizeLimit(limit));
        }

        let queryString = query.toString();
        return BaseModel.db.manyOrNone(queryString);
    }

    public async list(page: number = 1, limit: number = 100, disableLimit: boolean = false) {
        return BaseModel.list(this, page, limit, disableLimit);
    }

    public static async list(model: BaseModel, page: number = 1, limit: number = 100, disableLimit: boolean = false) {
        const query = QueryBuilder.table(model.tableName)
            .orderBy('id', 'asc')
            .select('*')

        if (!disableLimit) {
            query.limit(NormalizeLimit(limit))
                .offset(NormalizeOffset(page - 1) * NormalizeLimit(limit));
        }

        let queryString = query.toString();
        return BaseModel.db.manyOrNone(queryString);
    }
}