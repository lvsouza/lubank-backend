import { UserBalanceProvider } from "../user-balance/UserBalanceProvider";
import { IBilletInfo } from "../billet-info/IBilletInfo";
import { formatDate } from "../../../services/helper";
import { TableNames } from "../../TableNames";
import Knex from '../../connection';

export class PayBilletProvider {
    /**
     * Função paga um boleto, retornando o saldo atualizado do usuário
     * 
     * @param userId Usuário que pagará o boleto
     * @param code Código de barras do bolteto que será pago
     * @returns Saldo atualizado do usuário
     */
    async payByCode(userId: number, code: string): Promise<number | null> {

        // Busca o saldo atualizado com juros do usuário
        const userBalanceProvider = new UserBalanceProvider();
        const balance = await userBalanceProvider.getBalanceByUserId(userId);
        if (!balance) return null;

        const trx = await Knex.transaction();

        try {
            const billet = await trx(TableNames.billet)
                .select<IBilletInfo>('id', 'code', 'favored', 'value')
                .where('code', code)
                .first();
            if (!billet) return null;

            // Impede que seja realizado uma transferência se não tiver saldo
            if ((balance - billet.value) < 0) return null;

            // Atualiza o saldo na base de dados
            const wasUpdated = await trx(TableNames.account)
                .where('user_id', userId)
                .update({
                    balance: balance - billet.value,
                    last_update: formatDate(new Date(Date.now())),
                });

            if (wasUpdated === 0) {
                trx.rollback();
                return null;
            };

            // Apaga o boleto pago da base
            await trx(TableNames.billet)
                .where('code', code)
                .del();

            trx.commit();

            return parseFloat(`${balance - billet.value}`);
        } catch (_) {
            trx.rollback();
            return null;
        }
    }
}
