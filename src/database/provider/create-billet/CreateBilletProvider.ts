import { ICreateBillet } from "./ICreateBillet";
import { TableNames } from "../../TableNames";
import knex from './../../connection';

export class CreateBilletProvider {
    async execute(billet: ICreateBillet): Promise<Omit<ICreateBillet, 'favored' | 'value'> | null> {
        try {
            if (billet.value <= 0) return null;
            if (billet.code.trim().length <= 3) return null;
            if (billet.favored.trim().length <= 2) return null;

            const insertedIds = await knex(TableNames.billet).insert(billet);
            if (!insertedIds[0]) return null;

            return { code: billet.code };
        } catch (_) {
            return null;
        }
    }
}
