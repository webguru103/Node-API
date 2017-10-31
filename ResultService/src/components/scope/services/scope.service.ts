import { IScope } from "../interfaces/scope.interface";
import { ScopeFilter } from "../filters/scope.filter";
import { Scope } from "../models/scope.model";
import { map } from "bluebird";

export class ScopeService {
    async add(data: IScope): Promise<IScope> {
        // find exising scope
        const filter = new ScopeFilter(data);
        filter.name_exact = true;
        const [scope] = await filter.find();
        // if scope found
        if (scope) return scope.update(data);
        // create new scope
        return new Scope(data).saveWithID();
    }

    async get(filter: Partial<ScopeFilter>): Promise<IScope> {
        const [scope] = await this.list(filter);
        return scope;
    }

    async list(filter: Partial<ScopeFilter>): Promise<IScope[]> {
        return new ScopeFilter(filter).find();
    }

    async update(data: IScope): Promise<IScope | undefined> {
        const scope = <Scope | undefined>await Scope.findOne(<any>Scope, { id: data.id })
        // if scope does not found return
        if (!scope) return;
        // update scope
        return new Scope(scope).update(data);
    }

    async updateMany(data: IScope[]): Promise<(IScope | undefined)[]> {
        return map(data, scope => this.update(scope));
    }

    async delete(data: IScope): Promise<any> {
        return Scope.delete(<any>Scope, data);
    }
}