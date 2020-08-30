import { ICreateBillet } from '../create-billet/ICreateBillet';
import { TableNames } from '../../TableNames';
import knex from './../../connection';
import { BilletInfoProvider } from './BilletInfoProvider';

describe('Busca informações de boletos', () => {
    beforeAll(async () => {

        // Usuários que serão colocados na base para serem usados nos testes
        const billets: ICreateBillet[] = [
            { code: '12345', favored: 'Teste 1', value: 450.00 },
            { code: '6789', favored: 'Teste 2', value: 1000.00 },
            { code: '123789456', favored: 'Teste 3', value: 50.00 },
        ];

        // Inicia um banco de dados em memória 
        await knex.migrate.latest();

        // Insere usuário e suas contas de teste na base
        await knex(TableNames.billet).insert(billets);
    });

    // BOLETO teste1
    test('Busca boleto 1', async () => {
        const billetInfoProvider = new BilletInfoProvider();
        expect(await billetInfoProvider.findByCode('12345')).toEqual({ id: 1, code: '12345', favored: 'Teste 1', value: parseFloat('450.00') });
    });

    // BOLETO teste2
    test('Busca boleto 2', async () => {
        const billetInfoProvider = new BilletInfoProvider();
        expect(await billetInfoProvider.findByCode('12345')).toEqual({ id: 2, code: '6789', favored: 'Teste 2', value: parseFloat('1000.00') });
    });

    // BOLETO teste3
    test('Busca boleto 3', async () => {
        const billetInfoProvider = new BilletInfoProvider();
        expect(await billetInfoProvider.findByCode('123789456')).toEqual({ id: 3, code: '123789456', favored: 'Teste 3', value: parseFloat('50.00') });
    });

    test('Busca boleto que existe', async () => {
        const billetInfoProvider = new BilletInfoProvider();
        expect(await billetInfoProvider.findByCode('12378912313456')).toBe(null);
    });
});
