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
        const usersAccounts: any[] = [
            { id: null, account_number: '0000000-0', agency: 1102, balance: 0, last_update: knex.fn.now(), user_id: 1 },
            { id: null, account_number: '0000001-0', agency: 1102, balance: 0, last_update: knex.fn.now(), user_id: 2 },
        ];

        // Inicia um banco de dados em memória para cada teste que for executado 
        await knex.migrate.latest();

        // Insere usuário e suas contas de teste na base
        await knex(TableNames.user).insert(users);
        await knex(TableNames.account).insert(usersAccounts);
    });

    // USUÀRIO teste 1
    test('Busca user 1 - valida `id`', async () => {
        const userInfoProvider = new UserInfoProvider();
        expect((await userInfoProvider.getByEmail('test1@gmail.com'))?.id).toEqual(1);
    });

    test('Busca user 1 - valida `name`', async () => {
        const userInfoProvider = new UserInfoProvider();
        expect((await userInfoProvider.getByEmail('test1@gmail.com'))?.name).toEqual('Tester 1');
    });

    test('Busca user 1 - valida `email`', async () => {
        const userInfoProvider = new UserInfoProvider();
        expect((await userInfoProvider.getByEmail('test1@gmail.com'))?.email).toEqual('test1@gmail.com');
    });

    test('Busca user 1 - valida `account_number`', async () => {
        const userInfoProvider = new UserInfoProvider();
        expect((await userInfoProvider.getByEmail('test1@gmail.com'))?.account_number).toEqual('0000000-0');
    });

    test('Busca user 1 - valida `agency`', async () => {
        const userInfoProvider = new UserInfoProvider();
        expect((await userInfoProvider.getByEmail('test1@gmail.com'))?.agency).toEqual(1102);
    });

    // USUÀRIO teste 2
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

    test('Busca user 2 - valida `email`', async () => {
        const userInfoProvider = new UserInfoProvider();
        expect((await userInfoProvider.getByEmail('test2@gmail.com'))?.email).toEqual('test2@gmail.com');
    });

    test('Busca user 2 - valida `account_number`', async () => {
        const userInfoProvider = new UserInfoProvider();
        expect((await userInfoProvider.getByEmail('test2@gmail.com'))?.account_number).toEqual('0000001-0');
    });

    test('Busca user 2 - valida `agency`', async () => {
        const userInfoProvider = new UserInfoProvider();
        expect((await userInfoProvider.getByEmail('test2@gmail.com'))?.agency).toEqual(1102);
    });
});
