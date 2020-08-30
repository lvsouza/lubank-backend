import { CreateBilletProvider } from './CreateBilletProvider';
import { ICreateBillet } from './ICreateBillet';
import knex from './../../connection';

describe('Cria boletos', () => {
    beforeAll(async () => {

        // Inicia um banco de dados em memória 
        await knex.migrate.latest();
    });

    test('Cria um novo boleto', async () => {
        const data: ICreateBillet = { code: '123456789', favored: 'Juca Pedroso', value: 450.00 };

        const createBilletProvider = new CreateBilletProvider();
        expect(await createBilletProvider.execute(data)).toEqual({ code: '123456789' });
    });

    test('Cria um boleto duplicado', async () => {
        const data: ICreateBillet = { code: '123456789', favored: 'Juca Pedroso', value: 450.00 };

        const createBilletProvider = new CreateBilletProvider();
        expect(await createBilletProvider.execute(data)).toBe(null);
    });

    test('Cria um boleto com valor 0.00', async () => {
        const data: ICreateBillet = { code: '112233445566778899', favored: 'Juca Pedroso', value: 0.00 };

        const createBilletProvider = new CreateBilletProvider();
        expect(await createBilletProvider.execute(data)).toBe(null);
    });

    test('Cria um boleto com valor -50.00', async () => {
        const data: ICreateBillet = { code: '112233445566778899', favored: 'Juca Pedroso', value: -50.00 };

        const createBilletProvider = new CreateBilletProvider();
        expect(await createBilletProvider.execute(data)).toBe(null);
    });

    test('Cria um boleto sem code', async () => {
        const data: ICreateBillet = { code: '', favored: 'Juca Pedroso', value: 50.00 };

        const createBilletProvider = new CreateBilletProvider();
        expect(await createBilletProvider.execute(data)).toBe(null);
    });

    test('Cria um boleto sem favored', async () => {
        const data: ICreateBillet = { code: '1364659879852', favored: '', value: 50.00 };

        const createBilletProvider = new CreateBilletProvider();
        expect(await createBilletProvider.execute(data)).toBe(null);
    });
});
