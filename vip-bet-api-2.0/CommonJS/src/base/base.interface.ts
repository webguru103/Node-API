import * as knex from 'knex';
type RangeType = string | number | boolean | Date | Array<string> | Array<number> | Array<Date> | Array<boolean> | Buffer | knex.Raw;

export interface IBase {
    save(conflictRule?: string): Promise<any>;
    saveWithID(conflictRule?: string): Promise<any>;
    update(data?: any, byFields?: any): Promise<any>;
    delete(byFields: any): Promise<any>;
    deleteMany(filterInField: string, filterIn: any[]): Promise<any>;
    findOne(fields: any): Promise<any | undefined>;
    findMany(filter: any, filterInField: string | undefined, filterIn: any[] | undefined, page: number, limit: number): Promise<any[] | undefined>;
    findManyBetween(filter: any, dateField: string, range: [RangeType, RangeType], page: number, limit: number): Promise<any[]>;
    list(page: number, limit: number, disableLimit: boolean): Promise<any[]>;
}