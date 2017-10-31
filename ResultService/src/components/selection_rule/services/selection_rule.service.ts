import { ISelectionRule } from "../interfaces/selection_rule.interface";
import { SelectionRuleFilter } from "../filters/selection_rule.filter";
import { SelectionRule } from "../models/selection_rule.model";
import { map } from "bluebird";

export class SelectionRuleService {
    async add(data: ISelectionRule): Promise<ISelectionRule> {
        // find exising category
        let [rule] = await new SelectionRuleFilter({ id: data.id }).find();
        // if category found
        if (rule) return rule.update(data);
        // create new category
        return new SelectionRule(data).saveWithID();
    }
    async addMany(rules: ISelectionRule[]): Promise<void> {
        if (!rules) return;
        await map(rules, async rule => this.add(rule));
    }
    async get(filter: Partial<SelectionRuleFilter>): Promise<ISelectionRule> {
        const [rule] = await this.list(filter);
        return rule;
    }

    async list(filter: Partial<SelectionRuleFilter>): Promise<ISelectionRule[]> {
        return new SelectionRuleFilter(filter).find();
    }

    async update(data: ISelectionRule): Promise<ISelectionRule | undefined> {
        const rule = <SelectionRule | undefined>await SelectionRule.findOne(<any>SelectionRule, { id: data.id })
        // if rule does not found return
        if (!rule) return;
        // update rule
        return new SelectionRule(rule).update(data);
    }

    async delete(data: ISelectionRule): Promise<any> {
        return SelectionRule.delete(<any>SelectionRule, data);
    }
}