import { TableNames } from "../../TableNames";
import { IUserInfo } from "./IUserInfo";
import Knex from './../../connection';

export class UserInfoProvider {
    async getByEmail(email: string): Promise<IUserInfo | null> {
        try {
            const user = await Knex(TableNames.user)
                .select<{ id: number, name: string }[]>('id', 'name')
                .where({ email })
                .first();

            if (!user?.id) return null;

            // Gera o token de autenticação e devolve para o usuário
            return {
                email,
                id: user.id,
                name: user.name,
            };
        } catch (_) {
            return null;
        }
    }
}