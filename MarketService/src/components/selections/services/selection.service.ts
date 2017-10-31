import { ISelectionModel } from "../interfaces/selection.interface";
import { SelectionModel } from "../models/selection.model";
import { Translate } from "../../../../../CommonJS/src/components/translates/models/translate.model";
import { DEFAULT_LANGUAGE } from "../../../../../CommonJS/src/domain/constant";
import { SelectionFilter } from "../filters/selection.filter";
import { broker } from "../../../../../CommonJS/src/base/base.model";
import { CommunicationCodes } from "../../../../../CommonJS/src/messaging/CommunicationCodes";
import { QueueType } from "../../../../../CommonJS/src/messaging/QueueType";

export class SelectionService {
    async add(data: ISelectionModel): Promise<ISelectionModel> {
        // find selection if it is already exists
        let selection:ISelectionModel = await SelectionModel.findOne(<any>SelectionModel, { name: data.name, market_id: data.market_id });
        if (selection) return selection;
        if (!data.lang_id) data.lang_id = DEFAULT_LANGUAGE;
        // save translation
        const translate = new Translate({ lang_id: data.lang_id, translation: data.name });
        await translate.saveWithID();
        // create insance
        selection = new SelectionModel(data);
        // set dict_id
        selection.dict_id = translate.dict_id;
        // save selection
        return selection.saveWithID();
    }

    async get(filter: Partial<SelectionFilter>): Promise<ISelectionModel> {
        // find seletion
        const [selection] = await this.list(filter);
        // return first selection
        return selection;
    }

    async list(filter: Partial<SelectionFilter>): Promise<ISelectionModel[]> {
        // create filter
        const selectionFilter = new SelectionFilter(filter);
        // find selections
        return selectionFilter.find();
    }

    async update(data: ISelectionModel): Promise<ISelectionModel> {
        // update translation
        await Translate.update(<any>Translate, { translation: data.name }, { lang_id: data.lang_id, dict_id: data.dict_id });
        // update selection
        const selection = new SelectionModel(data);
        // remove name if it is not in default language
        if (data.lang_id !== DEFAULT_LANGUAGE) delete selection.name;
        // update selection
        return selection.update();
    }

    async delete(data: ISelectionModel): Promise<any> {
        // delete rules
        await broker.sendRequest(CommunicationCodes.DELETE_RULES, { id: data.id }, QueueType.RESULT_SERVICE);
        // delete mapping
        await broker.sendRequest(CommunicationCodes.UN_MAP_SYSTEM_SELECTION, { id: data.id }, QueueType.RESULT_SERVICE);
        // delete selection
        const selection = new SelectionModel(data);
        await selection.delete();
        // delete translations
        await Translate.delete(<any>Translate, { dict_id: data.dict_id });
    }
}