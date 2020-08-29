import { ICreateUser } from '../create-user/ICreateUser';
import { UserInfoProvider } from './UserInfoProvider';
import { passHash } from '../../../services/auth';
import { TableNames } from '../../TableNames';
import knex from './../../connection';

describe('Busca informações de usuários', () => {
    beforeAll(async () => {

        // Usuários que serão colocados na base para serem usados nos testes
        const users: ICreateUser[] = [
            { id: null, email: 'test1@gmail.com', name: 'Tester 1', password: await passHash('123456') },
            { id: null, email: 'test2@gmail.com', name: 'Tester 2', password: await passHash('123456') },
        ];

        // Inicia um banco de dados em memória para cada teste que for executado 
        await knex.migrate.latest();

        // Insere usuário de teste na base
        await knex(TableNames.user).insert(users);
    });

    test('Busca user 1 - valida `id`', async () => {
        const userInfoProvider = new UserInfoProvider();
        expect((await userInfoProvider.getByEmail('test1@gmail.com'))?.id).toEqual(1);
    });

    test('Busca user 1 - valida `name`', async () => {
        const userInfoProvider = new UserInfoProvider();
        expect((await userInfoProvider.getByEmail('test1@gmail.com'))?.name).toEqual('Tester 1');
    });

    test('Busca user 2 - valida `id`', async () => {
        const userInfoProvider = new UserInfoProvider();
        expect((await userInfoProvider.getByEmail('test2@gmail.com'))?.id).toEqual(2);
    });

    test('Busca user 2 - valida `name`', async () => {
        const userInfoProvider = new UserInfoProvider();
        expect((await userInfoProvider.getByEmail('test2@gmail.com'))?.name).toEqual('Tester 2');
    });

    test('Busca user usuário que não existe', async () => {
        const userInfoProvider = new UserInfoProvider();
        expect((await userInfoProvider.getByEmail('naoexiste@gmail.com'))).toBeNull();
    });
});
