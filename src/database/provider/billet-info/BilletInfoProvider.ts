import { IBilletInfo } from "./IBilletInfo";

export class BilletInfoProvider {
    async findByCode(code: string): Promise<IBilletInfo | null> {
        throw new Error("Not implemented");
    }
}
