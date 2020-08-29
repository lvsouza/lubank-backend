import { ICreateUser } from '../create-user/ICreateUser';
import { formatDate } from '../../../services/helper';
import { DepositProvider } from './DepositProvider';
import { passHash } from '../../../services/auth';
import { TableNames } from '../../TableNames';
import knex from './../../connection';

describe('Busca saldo da conta', () => {
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
        ];
        const usersAccounts: any[] = [
            { id: null, account_number: '0000001-0', agency: 1102, user_id: 1, balance: 0,      last_update: formatDate(new Date(Date.now())) },
            { id: null, account_number: '0000002-0', agency: 1102, user_id: 2, balance: 500.00, last_update: formatDate(addDays(new Date(Date.now()), -1)) },
        ];

        // Inicia um banco de dados em memória 
        await knex.migrate.latest();

        // Insere usuário e suas contas de teste na base
        await knex(TableNames.user).insert(users);
        await knex(TableNames.account).insert(usersAccounts);
    });

    // USUÀRIO teste1
    test('Realiza um deposito para o usuário 1', async () => {
        const depositProvider = new DepositProvider();
        expect(await depositProvider.execute(1, 50.00)).toEqual({ balance: parseFloat('50.00') });
    });

    // USUÀRIO teste2
    test('Realiza um deposito para o usuário 2 que está a um dia sem atualizar a conta com juros', async () => {
        const depositProvider = new DepositProvider();
        expect(await depositProvider.execute(2, 50.00)).toEqual({ balance: parseFloat('555.00') });
    });
});
