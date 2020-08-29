import { AuthorizeUserProvider } from './AuthorizeUserProvider';
import { ICreateUser } from '../create-user/ICreateUser';
import { passHash, jwtDecode } from '../../../services/auth';
import { TableNames } from '../../TableNames';
import knex from './../../connection';

describe('Authenticação de usuários', () => {
    beforeAll(async () => {

        // Usuários que serão colocados na base para serem usados nos testes
        const users: ICreateUser[] = [
            { id: null, email: 'test@gmail.com', name: 'Tester', password: await passHash('123456') },
            { id: null, email: 'test1@gmail.com', name: 'Tester 1', password: await passHash('123456') },
        ];

        // Configura a variável de ambiente para o JWT
        process.env.JWT_SECRET = '123456'

        // Inicia um banco de dados em memória para cada teste que for executado 
        await knex.migrate.latest();

        // Insere usuário de teste na base
        await knex(TableNames.user).insert(users);
    });

    test('Criação do token jwt', async () => {
        const authorizeUserProvider = new AuthorizeUserProvider();

        expect(
            await authorizeUserProvider
                .execute({
                    email: 'test@gmail.com',
                    password: '123456'
                })
        ).toBeTruthy();
    });

    test('Validação do token jwt', async () => {
        const authorizeUserProvider = new AuthorizeUserProvider();

        const accessToken = await authorizeUserProvider.execute({
            email: 'test@gmail.com',
            password: '123456'
        })

        expect(jwtDecode(String(accessToken))).toEqual({ user_id: 1 });
    });

    test('Tentativa de criar token para usuário que não existe', async () => {
        const authorizeUserProvider = new AuthorizeUserProvider();

        expect(
            await authorizeUserProvider
                .execute({
                    email: 'usernaoexiste@gmail.com',
                    password: '123456'
                })
        ).toBe(null);
    });
});
