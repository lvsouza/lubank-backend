import { TransactionHistoryProvider } from './TransactionHistoryProvider';
import { TransactionTypes } from '../../TransactionTypes';
import { ICreateUser } from '../create-user/ICreateUser';
import { formatDate } from '../../../services/helper';
import { passHash } from '../../../services/auth';
import { TableNames } from '../../TableNames';
import knex from '../../connection';

describe('Realiza o pagamento de um boleto', () => {
    beforeAll(async () => {

        // Adiciona nas var de ambiente o porcentagem de juros ao dia
        process.env.PERCENTAGE_PER_DAY = '1';

        // Usuários que serão colocados na base para serem usados nos testes
        const users: ICreateUser[] = [
            { id: null, email: 'test1@gmail.com', name: 'Tester 1', password: await passHash('123456') },
            { id: null, email: 'test2@gmail.com', name: 'Tester 2', password: await passHash('123456') },
            { id: null, email: 'test3@gmail.com', name: 'Tester 3', password: await passHash('123456') },
        ];

        const usersAccounts: any[] = [
            { id: null, account_number: '0000000-0', agency: 1102, user_id: 1, balance: 0, last_update: formatDate(new Date(Date.now())) },
            { id: null, account_number: '0000001-0', agency: 1102, user_id: 2, balance: 0, last_update: formatDate(new Date(Date.now())) },
            { id: null, account_number: '0000002-0', agency: 1102, user_id: 3, balance: 0, last_update: formatDate(new Date(Date.now())) },
        ];

        const transactions: any[] = [
            { id: null, user_id: 1, value: 10, type_id: TransactionTypes.Deposit, created_at: knex.fn.now() },
            { id: null, user_id: 1, value: 50, type_id: TransactionTypes.Transfer, created_at: knex.fn.now() },
            { id: null, user_id: 1, value: 100, type_id: TransactionTypes.Payment, created_at: knex.fn.now() },
            { id: null, user_id: 2, value: 10, type_id: TransactionTypes.Deposit, created_at: knex.fn.now() },
            { id: null, user_id: 2, value: 50, type_id: TransactionTypes.Transfer, created_at: knex.fn.now() },
            { id: null, user_id: 2, value: 100, type_id: TransactionTypes.Payment, created_at: knex.fn.now() },
            { id: null, user_id: 2, value: 10, type_id: TransactionTypes.Deposit, created_at: knex.fn.now() },
            { id: null, user_id: 2, value: 50, type_id: TransactionTypes.Transfer, created_at: knex.fn.now() },
            { id: null, user_id: 2, value: 100, type_id: TransactionTypes.Payment, created_at: knex.fn.now() },
            { id: null, user_id: 2, value: 10, type_id: TransactionTypes.Deposit, created_at: knex.fn.now() },
            { id: null, user_id: 2, value: 50, type_id: TransactionTypes.Transfer, created_at: knex.fn.now() },
            { id: null, user_id: 2, value: 100, type_id: TransactionTypes.Payment, created_at: knex.fn.now() },
        ];

        // Inicia um banco de dados em memória 
        await knex.migrate.latest();

        // Insere usuário e suas contas de teste na base
        await knex(TableNames.user).insert(users);
        await knex(TableNames.account).insert(usersAccounts);

        // Insere as transações para serem consultadas
        await knex(TableNames.transaction).insert(transactions);

    });

    // Usuário 1
    test('Consulta a lista de transações user 1', async () => {
        const transactionHistoryProvider = new TransactionHistoryProvider();
        expect((await transactionHistoryProvider.getAllByUserId(1))?.length).toBe(3);
    });

    // Usuário 2
    test('Consulta a lista de transações user 2', async () => {
        const transactionHistoryProvider = new TransactionHistoryProvider();
        expect((await transactionHistoryProvider.getAllByUserId(2))?.length).toBe(9);
    });

    // Usuário 3
    test('Consulta a lista de transações user 3', async () => {
        const transactionHistoryProvider = new TransactionHistoryProvider();
        expect((await transactionHistoryProvider.getAllByUserId(3))?.length).toBe(0);
    });
});
