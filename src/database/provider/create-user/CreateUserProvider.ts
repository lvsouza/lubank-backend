import { TableNames } from '../../TableNames';
import { passHash } from '../../../services/auth';
import { ICreateUser } from "./ICreateUser";
import knex from './../../connection';
import { randomize } from '../../../services/helper';

/**
 * Create and valid a new user
 */
export class CreateUserProvider {
    /**
     * Insert a new user in the database
     */
    async execute(user: ICreateUser): Promise<Omit<ICreateUser, 'password'> | null> {
        try {
            const hashedPassword = await passHash(user.password);

            const insertedIds = await knex(TableNames.user)
                .insert({ ...user, password: hashedPassword });

            if (!insertedIds[0]) {
                return null;
            }

            //#region Cria a conta do usuário

            // IMPORTANTE
            /**
             * Esta solução usada para gera número de contas nunca poderá usada em "produção" de fato,
             * existem maneiras legais para criação de um número de conta bancária
             */
            let newAccountNumber: string;
            let oldAccount: { id: number } | undefined;

            do {
                newAccountNumber = `${randomize(1000000, 9999999)}-${randomize(0, 9)}`;

                // Valida na base se o número gerado aleatório ainda não existe
                oldAccount = await knex(TableNames.account)
                    .select<{ id: number }[]>('id')
                    .where({ account_number: newAccountNumber })
                    .first();

            } while (oldAccount);

            const isertedAccountIds = await knex(TableNames.account)
                .insert({
                    balance: 0,
                    agency: 1102,
                    last_update: knex.fn.now(),
                    user_id: Number(insertedIds[0]),
                    account_number: newAccountNumber,
                });

            if (!isertedAccountIds[0]) {
                return null;
            }

            //#endregion

            return {
                id: Number(insertedIds[0]),
                email: user.email,
                name: user.name,
            };
        } catch (e) {
            return null;
        }
    }
}
