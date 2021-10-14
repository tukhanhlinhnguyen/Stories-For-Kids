export interface IAuth {
    token: string;
    roles: string;
}

export interface IAction{
    type: string;
    payload?: any;
}