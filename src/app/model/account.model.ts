import { Role } from "./role";

export class Account {
    id : string;
    type : string;
    firstName : string;
    lastName : string;
    role : Role;
    jwtToken ?: string;
}