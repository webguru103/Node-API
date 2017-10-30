/**
 * Created by   on 3/10/2017.
 */


import { Provider } from "../models/provider.model";
import { map } from "bluebird";
import { ProviderFilter } from "../filters/provider.filter";

export class ProviderService {
    async getProviders(filterData: ProviderFilter): Promise<Provider[] | any[]> {
        let filter = new ProviderFilter(filterData);
        return filter.find();
    }

    async getProvider(filter: ProviderFilter): Promise<Provider | undefined> {
        const [provider] = await this.getProviders(filter);
        return provider;
    }

    async updateProvider(provider: Provider): Promise<Provider | undefined> {
        return Provider.update(<any>Provider, new Provider(provider));
    }

    async updateParserPing(ping: any): Promise<any> {
        let provider = await Provider.findOne(<any>Provider, { id: ping.id });
        if (!provider) return;
        await Provider.update(<any>Provider, ping);
    }

    async updateOrders(orders: any[]): Promise<any> {
        await map(orders, async provider => {
            return this.updateProvider(provider);
        })
    }
}