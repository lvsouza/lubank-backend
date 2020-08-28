import { string } from "@hapi/joi"

export interface IAuthorizeUser {
    email: string;
    password: string;
}