import { UserBalanceProvider } from './UserBalanceProvider';
import { ICreateUser } from '../create-user/ICreateUser';
import { formatDate } from '../../../services/helper';
import { passHash } from '../../../services/auth';
import { TableNames } from '../../TableNames';
import knex from './../../connection';

describe('Busca saldo da conta', () => {
    beforeAll(async () => {

        // Adiciona nas var de ambiente o porcentagem de juros ao dia
        process.env.PERCENTAGE_PER_DAY = '1';

        const addDays = (date: Date, days: number) => {
            date.setDate(date.getDate() + days);
            return date;
        }

        // Usuários que serão colocados na base para serem usados nos testes
        const users: ICreateUser[] = [
            { id: null, email: 'test1@gmail.com', name: 'Tester 1', password: await passHash('123456') },
            { id: null, email: 'test2@gmail.com', name: 'Tester 2', password: await passHash('123456') },
            { id: null, email: 'test3@gmail.com', name: 'Tester 3', password: await passHash('123456') },
            { id: null, email: 'test4@gmail.com', name: 'Tester 4', password: await passHash('123456') },
        ];
        const usersAccounts: any[] = [
            { id: null, account_number: '0000000-0', agency: 1102, user_id: 1, balance: 0,      last_update: formatDate(new Date(Date.now())) },
            { id: null, account_number: '0000001-0', agency: 1102, user_id: 2, balance: 450.00, last_update: formatDate(new Date(Date.now())) },
            { id: null, account_number: '0000002-0', agency: 1102, user_id: 3, balance: 500.00, last_update: formatDate(addDays(new Date(Date.now()), -1)) },
            { id: null, account_number: '0000003-0', agency: 1102, user_id: 4, balance: 500.00, last_update: formatDate(addDays(new Date(Date.now()), -10)) },
        ];

        // Inicia um banco de dados em memória para cada teste que for executado 
        await knex.migrate.latest();

        // Insere usuário e suas contas de teste na base
        await knex(TableNames.user).insert(users);
        await knex(TableNames.account).insert(usersAccounts);
    });

    // USUÀRIO teste1
    test('Busca saldo usuário teste1', async () => {
        const userBalanceProvider = new UserBalanceProvider();
        expect(await userBalanceProvider.getBalanceByUserId(1)).toBe(0);
    });


    // USUÀRIO teste2
    test('Busca saldo usuário teste2', async () => {
        const userBalanceProvider = new UserBalanceProvider();
        expect(await userBalanceProvider.getBalanceByUserId(2)).toBe(parseFloat('450.00'));
    });


    // USUÀRIO teste3
    test('Saldo usuário teste3 que rendeu de ** um dia para o outro **', async () => {
        const userBalanceProvider = new UserBalanceProvider();
        expect(await userBalanceProvider.getBalanceByUserId(3)).toBe(parseFloat('505.00'));
    });

    test('Valida usuário 3 se o calculo de rendimento está sendo feito apenas uma vez e não a cada consulta', async () => {
        const userBalanceProvider = new UserBalanceProvider();
        expect(await userBalanceProvider.getBalanceByUserId(3)).toBe(parseFloat('505.00'));
    });


    // USUÀRIO teste4
    test('Saldo usuário teste4 que rendeu ** por 10 dias **', async () => {
        const userBalanceProvider = new UserBalanceProvider();
        expect(await userBalanceProvider.getBalanceByUserId(4)).toBe(parseFloat('552.31'));
    });

    test('Valida usuário 4 se o calculo de rendimento está sendo feito apenas uma vez e não a cada consulta', async () => {
        const userBalanceProvider = new UserBalanceProvider();
        expect(await userBalanceProvider.getBalanceByUserId(4)).toBe(parseFloat('552.31'));
    });
});
