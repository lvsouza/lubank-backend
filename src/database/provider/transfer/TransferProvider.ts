import { UserBalanceProvider } from "../user-balance/UserBalanceProvider";
import { TransactionTypes } from "../../TransactionTypes";
import { formatDate } from "../../../services/helper";
import { TableNames } from "../../TableNames";
import Knex from '../../connection';

export class TransferProvider {
    async execute(userId: number, value: number): Promise<{ balance: number } | null> {
        try {

            // Busca e atualiza o saldo do usuário
            const userBalanceProvider = new UserBalanceProvider();
            const balance = await userBalanceProvider.getBalanceByUserId(userId);
            if (balance === null) return null;

            // Impede que seja realizado uma transferência se não tiver saldo
            if ((balance - value) < 0) return null;

            const insertedIds = await Knex(TableNames.transaction)
                .insert({ value, user_id: userId, type_id: TransactionTypes.Transfer, created_at: Knex.fn.now() });

            if (!insertedIds[0]) return null;

            // Atualiza o saldo na base de dados
            const wasUpdated = await Knex(TableNames.account)
                .where('user_id', userId)
                .update({
                    balance: balance - value,
                    last_update: formatDate(new Date(Date.now())),
                });

            if (wasUpdated === 0) return null;

            return {
                balance: parseFloat(`${balance - value}`)
            };
        } catch (e) {
            return null;
        }
    }
}
