import knex from './../../connection';
import { CreateUserProvider } from './CreateUserProvider';
import { ICreateUser } from './ICreateUser';

describe('Inscrição de usuário', () => {
    beforeAll(async () => {

        // Configura a variável de ambiente para o JWT
        process.env.JWT_SECRET = '123456'

        // Inicia um banco de dados em memória 
        await knex.migrate.latest();
    });

    const user1: ICreateUser = {
        id: null,
        password: '123456',
        email: 'test@gmail.com',
        name: 'Teste do desenvolvedor',
    };
    
    const user2: ICreateUser = {
        id: null,
        password: '123456',
        email: 'test2@gmail.com',
        name: 'Teste do desenvolvedor',
    };

    test('Criação de usuário 1', async () => {
        const createUserProvider = new CreateUserProvider();
        expect(await createUserProvider.execute(user1))
            .toEqual({
                id: 1,
                email: 'test@gmail.com',
                name: 'Teste do desenvolvedor',
            });
    });

    test('Criação de usuário 1 duplicado', async () => {
        const createUserProvider = new CreateUserProvider();
        expect(await createUserProvider.execute(user1)).toEqual(null);
    });

    test('Criação de usuário 2', async () => {
        const createUserProvider = new CreateUserProvider();
        expect(await createUserProvider.execute(user2))
            .toEqual({
                id: 2,
                email: 'test2@gmail.com',
                name: 'Teste do desenvolvedor',
            });
    });

    test('Criação de usuário 2 duplicado', async () => {
        const createUserProvider = new CreateUserProvider();
        expect(await createUserProvider.execute(user2)).toEqual(null);
    });
});
