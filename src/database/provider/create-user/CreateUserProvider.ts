import { hash, genSalt } from 'bcryptjs';

import { TableNames } from '../../TableNames';
import { ICreateUser } from "./ICreateUser";
import knex from './../../connection';

/**
 * Create and valid a new user
 */
export class CreateUserProvider {
    /**
     * Insert a new user in the database
     */
    async execute(user: ICreateUser): Promise<Omit<ICreateUser, 'password'> | null> {
        try {
            const hashedPassword = await hash(user.password, await genSalt(Number(process.env.HASH_SALT) || 10));

            const insertedIds = await knex(TableNames.user)
                .insert({ ...user, password: hashedPassword });

            return {
                id: Number(insertedIds[0]),
                email: user.email,
                name: user.name,
            };
        } catch (e) {
            return null;
        }
    }
}
