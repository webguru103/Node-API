import { ISelectionResult } from "../interfaces/selection_result.interface";
import { ResultType } from "../enums/result_type.enum";

export class SelectionResult implements ISelectionResult {
    public id: number;
    public result_type_id: ResultType;

    constructor(data: ISelectionResult) {
        this.id = data.id;
        this.result_type_id = data.result_type_id;
    }
}
