import { randomize } from '../../../services/helper';
import { passHash } from '../../../services/auth';
import { TableNames } from '../../TableNames';
import { ICreateUser } from "./ICreateUser";
import knex from './../../connection';

/**
 * Create and valid a new user
 */
export class CreateUserProvider {
    /**
     * Insert a new user in the database
     */
    async execute(user: ICreateUser): Promise<Omit<ICreateUser, 'password'> & { agency: number, accountNumber: string } | null> {
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
                accountNumber: newAccountNumber,
                id: Number(insertedIds[0]),
                email: user.email,
                name: user.name,
                agency: 1102.
            };
        } catch (e) {
            return null;
        }
    }
}
