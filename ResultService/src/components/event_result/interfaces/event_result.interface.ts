import { IBase } from "../../../../../CommonJS/src/base/base.interface";

export interface IEventResult extends IBase {
    id: number;
    results: IStatisticResult[];
}

export interface IStatisticResult {
    scope_id: number;
    statistic_type_id: number;
    scores: IScore[];
}

export interface IScore {
    participant_id: number;
    score: number;
    details: IScoreDetail[];
}

export interface IScoreDetail {
    time: IScoreDetail[];
}