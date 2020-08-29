import { compare } from "bcryptjs";
import Knex from './../../connection';

import { IAuthorizeUser } from "./IAuthorizeUserProvider";
import { jwtEncode } from "../../../services/auth";
import { TableNames } from "../../TableNames";

export class AuthorizeUserProvider {
    /* valid = celebrate({
        headers: Joi.object({
            password: Joi.string().required(),
            email: Joi.string().email().required(),
        }).unknown(),
    }); */

    async execute({ email, password }: IAuthorizeUser): Promise<string | null> {
        try {
            const user = await Knex(TableNames.user)
                .select<{ id: number, password: string }[]>('id', 'password')
                .where({ email })
                .first();

            // Valida se a senha informada é a mesma usada préviamente infomada
            const isMatch = await compare(password?.toString(), String(user?.password));
            if (!isMatch) return null;

            if (!user?.id) return null;

            // Gera o token de autenticação e devolve para o usuário
            return jwtEncode({ user_id: user.id });
        } catch (_) {
            return null;
        }
    }
}
