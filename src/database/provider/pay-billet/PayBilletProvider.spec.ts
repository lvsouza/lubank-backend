import { BilletInfoProvider } from '../billet-info/BilletInfoProvider';
import { ICreateBillet } from '../create-billet/ICreateBillet';
import { ICreateUser } from '../create-user/ICreateUser';
import { PayBilletProvider } from './PayBilletProvider';
import { formatDate } from '../../../services/helper';
import { passHash } from '../../../services/auth';
import { TableNames } from '../../TableNames';
import knex from '../../connection';

describe('Realiza o pagamento de um boleto', () => {
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
        ];

        const usersAccounts: any[] = [
            { id: null, account_number: '0000000-0', agency: 1102, user_id: 1, balance: 0, last_update: formatDate(new Date(Date.now())) },
            { id: null, account_number: '0000001-0', agency: 1102, user_id: 2, balance: 450.00, last_update: formatDate(new Date(Date.now())) },
            { id: null, account_number: '0000002-0', agency: 1102, user_id: 3, balance: 500.00, last_update: formatDate(addDays(new Date(Date.now()), -1)) },
        ];

        const billets: ICreateBillet[] = [
            { code: '123', favored: 'Teste 1', value: 450.00 },
            { code: '456', favored: 'Teste 2', value: 450.00 },
            { code: '789', favored: 'Teste 3', value: 450.00 },
            { code: '101112', favored: 'Teste 4', value: 10.00 },
        ];

        // Inicia um banco de dados em memória 
        await knex.migrate.latest();

        // Insere usuário e suas contas de teste na base
        await knex(TableNames.user).insert(users);
        await knex(TableNames.billet).insert(billets);
        await knex(TableNames.account).insert(usersAccounts);
    });

    // BOLETO 1 usuário 1
    test('Paga boleto 1 com usuário 1 que não tem saldo suficiente', async () => {
        const billetInfoProvider = new PayBilletProvider();
        expect(await billetInfoProvider.payByCode(1, '123')).toBe(null);
    });

    // BOLETO 1 usuário 2
    test('Paga boleto 1 com usuário 2 que tem saldo suficente', async () => {
        const billetInfoProvider = new PayBilletProvider();
        expect(await billetInfoProvider.payByCode(2, '456')).toBe(parseFloat('0.00'));
    });

    // BOLETO 1 usuário 3
    test('Paga boleto 1 com usuário 3 que tem saldo suficente. E será calculado o juros de um dia para o outro.', async () => {
        const billetInfoProvider = new PayBilletProvider();
        expect(await billetInfoProvider.payByCode(3, '789')).toBe(parseFloat('55.00'));
    });

    // BOLETO 2 usuário 3
    test('Tenta buscar informaçoões de um boleto que já foi pago e deletado da base.', async () => {
        const payBilletProvider = new PayBilletProvider();
        await payBilletProvider.payByCode(3, '101112');

        const billetInfoProvider = new BilletInfoProvider();
        expect(await billetInfoProvider.findByCode('101112')).toBe(null);
    }); 
});
