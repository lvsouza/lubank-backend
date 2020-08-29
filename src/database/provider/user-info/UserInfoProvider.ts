import { TableNames } from "../../TableNames";
import { IUserInfo } from "./IUserInfo";
import Knex from './../../connection';

export class UserInfoProvider {
    async getByEmail(email: string): Promise<IUserInfo | null> {
        try {
            const user = await Knex(TableNames.user)
                .select<{ id: number, name: string, account_number: number, agency: string }[]>(
                    `${TableNames.user}.id`,
                    `${TableNames.user}.name`,
                    `${TableNames.account}.agency`,
                    `${TableNames.account}.account_number`,
                )
                .innerJoin(`${TableNames.account}`, `${TableNames.account}.user_id`, `${TableNames.user}.id`)
                .where(`${TableNames.user}.email`, email)
                .first();

            if (!user?.id) return null;

            return {
                email,
                id: user.id,
                name: user.name,
                agency: user.agency,
                account_number: user.account_number,
            };
        } catch (_) {
            return null;
        }
    }
}
