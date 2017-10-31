export interface IUserBettingStatistics {
    user_id: number;
    roi?: number;
    total_count?: number;
    money_type?: number;
    single_count?: number;
    express_count?: number;
    system_count?: number;
    placed_total?: number;

    lost_amount?: number;
    lost_avg_odd?: number;
    lost_count?: number;
    lost_max_odd?: number;
    lost_min_odd?: number;
    lost_max?: number;
    lost_min?: number;
    
    won_amount?: number;
    won_avg_odd?: number;
    won_count?: number;
    won_max_odd?: number;
    won_min_odd?: number;
    won_max?: number;
    won_min?: number;
    
    active_amount?: number;
    active_avg_odd?: number;
    active_count?: number;
    active_max_odd?: number;
    active_min_odd?: number;
    active_max?: number;
    active_min?: number;

    max_odd?: number;
    min_odd?: number;
    avg_odd?: number;
    yield?: number;
}