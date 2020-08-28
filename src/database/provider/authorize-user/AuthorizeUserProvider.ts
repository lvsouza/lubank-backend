import { celebrate, Joi } from "celebrate";

import { IAuthorizeUser } from "./IAuthorizeUserProvider";

export class AuthorizeUserProvider {
    valid = celebrate({
        headers: Joi.object({
            password: Joi.string().required(),
            email: Joi.string().email().required(),
        }).unknown(),
    });

    execute(data: IAuthorizeUser): string {
        throw new Error("Not implemented");
    }
}