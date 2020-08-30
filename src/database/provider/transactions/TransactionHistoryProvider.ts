import { ITransactionInfo } from "./ITransactionInfo";

export class TransactionHistoryProvider {
    async getAllByUserId(userId: number): Promise<ITransactionInfo[] | null> {
        throw new Error("Not implemented");
    }
}
