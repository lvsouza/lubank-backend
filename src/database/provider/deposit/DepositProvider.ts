export class DepositProvider {
    async execute(userId: number, value: number): Promise<{ balance: number } | null> {
        throw new Error("Not implemented");
    }
}
