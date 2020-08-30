import { ICreateUser } from '../create-user/ICreateUser';
import { formatDate } from '../../../services/helper';
import { TransferProvider } from './TransferProvider';
import { passHash } from '../../../services/auth';
import { TableNames } from '../../TableNames';
import knex from './../../connection';

describe('Realiza transferência', () => {
    beforeAll(async () => {

        const addDays = (date: Date, days: number) => {
            date.setDate(date.getDate() + days);
            return date;
        }

        // Adiciona nas var de ambiente o porcentagem de juros ao dia
        process.env.PERCENTAGE_PER_DAY = '1';

        // Usuários que serão colocados na base para serem usados nos testes
        const users: ICreateUser[] = [
            { id: null, email: 'test1@gmail.com', name: 'Tester 1', password: await passHash('123456') },
            { id: null, email: 'test2@gmail.com', name: 'Tester 2', password: await passHash('123456') },
            { id: null, email: 'test3@gmail.com', name: 'Tester 3', password: await passHash('123456') },
        ];
        const usersAccounts: any[] = [
            { id: null, account_number: '0000001-0', agency: 1102, user_id: 1, balance: 50.00, last_update: formatDate(new Date(Date.now())) },
            { id: null, account_number: '0000002-0', agency: 1102, user_id: 2, balance: 500.00, last_update: formatDate(addDays(new Date(Date.now()), -1)) },
            { id: null, account_number: '0000003-0', agency: 1102, user_id: 3, balance: 0.00, last_update: formatDate(new Date(Date.now())) },
        ];

        // Inicia um banco de dados em memória 
        await knex.migrate.latest();

        // Insere usuário e suas contas de teste na base
        await knex(TableNames.user).insert(users);
        await knex(TableNames.account).insert(usersAccounts);
    });

    // USUÀRIO teste1
    test('Realiza uma transferência do usuário 1 para outro', async () => {
        const transferProvider = new TransferProvider();
        expect(await transferProvider.execute(1, 50.00)).toEqual({ balance: parseFloat('0.00') });
    });

    // USUÀRIO teste2
    test('Realiza uma transferência do usuário 2 que está a um dia sem atualizar a conta com juros para outro', async () => {
        const transferProvider = new TransferProvider();
        expect(await transferProvider.execute(2, 50.00)).toEqual({ balance: parseFloat('455.00') });
    });

    // USUÀRIO teste3
    test('Tenta uma transferência do usuário 3 que está com saldo em conta zerado', async () => {
        const transferProvider = new TransferProvider();
        expect(await transferProvider.execute(3, 50.00)).toBe(null);
    });
});
