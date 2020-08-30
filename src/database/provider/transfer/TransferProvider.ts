export class TransferProvider {
    async execute(userId: number, value: number): Promise<{ balance: number } | null> {
        throw new Error("Not implemented");
    }
}
