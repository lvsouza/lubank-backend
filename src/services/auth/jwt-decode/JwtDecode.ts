import * as jwt from 'jsonwebtoken';

/**
 * Extrai os dados contido no token
 */
export const jwtDecode = (token: string): { user_id: number } | null => {
    try {
        const { user_id } = jwt.verify(token, process.env.JWT_SECRET || '') as any;
        return { user_id };
    } catch (error) {
        return null;
    }
}
