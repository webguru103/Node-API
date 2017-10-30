export interface IUserAction {
    id?: number;
    user_id: number;
    date?: Date;
    ip?: string;
    action?: string;
}