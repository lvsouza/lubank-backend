import * as jwt from 'jsonwebtoken';
import { IJwtData } from './../IJwtData';

/**
 * Transforma todas as propriedades em props obrigatórias do tipo string.
 */
type RequirePropsMap<T> = { [key in keyof T]: string | number };

/**
 * Codifica as informações importantes de usuário que validar que ele está autenticado na aplicação
 * @param jwtData Contém informações que serão transformadas em token
 */
export const jwtEncode = (jwtData: RequirePropsMap<IJwtData>) => {
    const accessToken = jwt.sign(jwtData, process.env.JWT_SECRET || '', { expiresIn: "1d" });
    return accessToken;
}
