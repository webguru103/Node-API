/**
 * Created by   on 3/4/2017.
 */
import { ISelectionMapping } from "../../components/selection/interfaces/selection.mapping.interface";

export interface ISelectionMappingDAL {
    addMapping(providerId: number, providerSelectionId: string, providerSelectionName: string,
        providerMarketId: string, providerCategoryId: string): Promise<number>;
    map(mapId: number, systemSelectionId: number): Promise<ISelectionMapping>;
    getMapping(providerId: number, providerSelectionId: string, providerMarketId: string, providerCategoryId: string): Promise<ISelectionMapping>;
    unMap(mapId: number);
    unMapSystemSelection(systemSelectionId: number);
    unMapMarketSelections(providerId: number, providerMarketId: number);
    getMappingsByProviderIdAndMarketId(providerId: number, providerMarketId: number, systemCategoryId: string);
    getProviderSelectionId(mapId: number);

}