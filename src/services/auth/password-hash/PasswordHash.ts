import { hash, genSalt } from 'bcryptjs';

export const passHash = async (pass: string) => await hash(pass, await genSalt(Number(process.env.HASH_SALT) || 10));
