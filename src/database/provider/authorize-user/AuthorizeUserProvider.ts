import { compare } from "bcryptjs";

import { IAuthorizeUser } from "./IAuthorizeUserProvider";
import { jwtEncode } from "../../../services/auth";
import { TableNames } from "../../TableNames";
import Knex from './../../connection';

export class AuthorizeUserProvider {
    async execute({ email, password }: IAuthorizeUser): Promise<string | null> {
        try {
            const user = await Knex(TableNames.user)
                .select<{ id: number, password: string }[]>('id', 'password')
                .where({ email })
                .first();

            // Valida se a senha informada é a mesma usada préviamente infomada
            const isMatch = await compare(password?.toString(), String(user?.password));
            if (!isMatch) return null;

            // Valida se o usuário foi encontrado
            if (!user?.id) return null;

            // Gera o token de autenticação e devolve para o usuário
            return jwtEncode({ user_id: user.id });
        } catch (_) {
            return null;
        }
    }
}
