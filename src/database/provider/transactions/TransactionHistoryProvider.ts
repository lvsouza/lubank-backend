import { ITransactionInfo } from "./ITransactionInfo";
import knex from '../../connection';
import { TableNames } from "../../TableNames";

export class TransactionHistoryProvider {
    async getAllByUserId(userId: number): Promise<ITransactionInfo[] | null> {
        try {
            const transactions = await knex(TableNames.transaction)
                .select<ITransactionInfo[]>('created_at', 'type_id', 'value')
                .where('user_id', userId);

            if (!transactions) return null;

            return transactions;
        } catch (_) {
            return null;
        }
    }
}
