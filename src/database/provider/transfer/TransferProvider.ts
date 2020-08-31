import { UserBalanceProvider } from "../user-balance/UserBalanceProvider";
import { TransactionTypes } from "../../TransactionTypes";
import { formatDate } from "../../../services/helper";
import { TableNames } from "../../TableNames";
import knex from '../../connection';

export class TransferProvider {
    async execute(userId: number, value: number): Promise<{ balance: number } | null> {

        // Busca e atualiza o saldo do usuário
        const userBalanceProvider = new UserBalanceProvider();
        const balance = await userBalanceProvider.getBalanceByUserId(userId);
        if (balance === null) return null;

        // Impede que seja realizado uma transferência se não tiver saldo
        if ((balance - value) < 0) return null;

        const trx = await knex.transaction();

        try {
            const insertedIds = await trx(TableNames.transaction)
                .insert({ value, user_id: userId, type_id: TransactionTypes.Transfer, created_at: trx.fn.now() });

            if (!insertedIds[0]) {
                trx.rollback();
                return null;
            }

            // Atualiza o saldo na base de dados
            const wasUpdated = await trx(TableNames.account)
                .where('user_id', userId)
                .update({
                    balance: balance - value,
                    last_update: formatDate(new Date(Date.now())),
                });

            if (wasUpdated === 0) {
                trx.rollback();
                return null;
            }

            trx.commit();
            return {
                balance: parseFloat(`${balance - value}`)
            };
        } catch (e) {
            trx.rollback();
            return null;
        }
    }
}
