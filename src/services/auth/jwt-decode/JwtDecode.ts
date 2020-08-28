import * as jwt from 'jsonwebtoken';

import { IJwtData } from './../IJwtData';

/**
 * Extrai os dados contido no token
 */
export const jwtDecode = (token: string) => {
    try {
        const { user_id } = jwt.verify(token, process.env.JWT_SECRET || '') as any;
        return { user_id };
    } catch (error) {
        return {
            user_id: null
        };
    }
}
