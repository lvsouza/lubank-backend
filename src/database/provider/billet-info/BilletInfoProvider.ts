import { TableNames } from "../../TableNames";
import { IBilletInfo } from "./IBilletInfo";
import Knex from '../../connection';

export class BilletInfoProvider {
    async findByCode(code: string): Promise<IBilletInfo | null> {
        try {
            const billet = await Knex(TableNames.billet)
                .select<IBilletInfo>('id', 'code', 'favored', 'value')
                .where('code', code)
                .first();


            if (!billet) return null;

            return {
                ...billet,
                value: parseFloat(`${billet.value}`)
            };
        } catch (_) {
            return null;
        }
    }
}
