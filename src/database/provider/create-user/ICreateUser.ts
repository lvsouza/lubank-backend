/**
 * Requisitos para a criação e um usuário
 */
export interface ICreateUser {
    id: number | null;
    password: string;
    email: string;
    name: string;
}
