import { diffDates, formatDate } from "../../../services/helper";
import { TableNames } from "../../TableNames";
import knex from './../../connection';

export class UserBalanceProvider {
    /**
     * Função retorna o saldo com juros atualizado em conta do usuário em questão
     * 
     * @param id `user_id` do usuário que está sedo consultado
     */
    async getBalanceByUserId(id: number): Promise<number | null> {
        const trx = await knex.transaction();

        try {
            let userAccount = await trx(TableNames.account)
                .select<{ balance: number, last_update: string }[]>('balance', 'last_update')
                .where({ user_id: id })
                .first();

            if (userAccount?.balance === undefined) {
                trx.rollback();
                return null;
            }

            const currentdate = formatDate(new Date(Date.now()));
            const outdatedNumberOfDays = diffDates(new Date(userAccount.last_update), new Date(currentdate));

            if (outdatedNumberOfDays > 0) {
                let days = outdatedNumberOfDays;

                do {
                    /** Adiciona o juro para apenas um dia */
                    userAccount.balance = userAccount.balance + ((Number(process.env.PERCENTAGE_PER_DAY || 1) / 100) * userAccount.balance)
                    days--;
                } while (days > 0);

                // Atualiza o saldo na base de dados
                const res = await trx(TableNames.account)
                    .update({
                        last_update: currentdate,
                        balance: userAccount.balance,
                    })
                    .where('user_id', id);

                // Se a inserção deu errado retorna null
                if (res === 0) {
                    trx.rollback();
                    return null;
                }
            }

            trx.commit();
            return parseFloat(userAccount.balance.toFixed(2));
        } catch (_) {
            trx.rollback();
            return null;
        }
    }
}
