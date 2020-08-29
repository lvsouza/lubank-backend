import { diffDates, formatDate } from "../../../services/helper";
import { TableNames } from "../../TableNames";
import Knex from './../../connection';

export class UserBalanceProvider {
    /**
     * Função retorna o saldo com juros atualizado em conta do usuário em questão
     * 
     * @param id `user_id` do usuário que está sedo consultado
     */
    async getBalanceByUserId(id: number): Promise<number | null> {
        try {
            let userAccount = await Knex(TableNames.account)
                .select<{ balance: number, last_update: string }[]>('balance', 'last_update')
                .where({ user_id: id })
                .first();

            if (userAccount?.balance === undefined) {
                return null;
            }

            const outdatedNumberOfDays = diffDates(new Date(userAccount.last_update), new Date(Date.now()));
            if (outdatedNumberOfDays > 0) {
                let days = outdatedNumberOfDays;

                do {
                    /** Adiciona o juro para apenas um dia */
                    userAccount.balance = userAccount.balance + ((Number(process.env.PERCENTAGE_PER_DAY || 1) / 100) * userAccount.balance)
                    days--;
                } while (days > 0);

                // Atualiza o saldo na base de dados
                const res = await Knex(TableNames.account)
                    .update({
                        balance: userAccount.balance,
                        last_update: formatDate(new Date(Date.now())),
                    })
                    .where('user_id', id);

                // Se a inserção deu errado retorna null
                if (res === 0) return null;
            }

            return parseFloat(userAccount.balance.toFixed(2));
        } catch (_) {
            return null;
        }
    }
}
