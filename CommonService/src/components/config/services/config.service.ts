import { ConfigModel } from "../models/config.model";

export class ConfigService {
    public getConfig(configTypeId: number): Promise<ConfigModel | undefined> {
        return ConfigModel.findOne(<any>ConfigModel, { config_type_id: configTypeId });
    }
    
    public updateConfig(config: ConfigModel): Promise<ConfigModel | undefined> {
        return ConfigModel.update(<any>ConfigModel, config);
    }
}