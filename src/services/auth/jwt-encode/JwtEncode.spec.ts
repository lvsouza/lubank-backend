import { jwtEncode } from "./JwtEncode";

describe('Criação de um JWT', () => {
    beforeAll(() => {

        // Configura a variável de ambiente para o JWT
        process.env.JWT_SECRET = '123456';
    });

    test('Testa a criação de um jwt com um fake user_id', () => {
        const user_id = '10';

        const tokenValidation = () => {
            const token = jwtEncode({ user_id });
            return token.split('.').length;
        }

        expect(tokenValidation()).toBe(3);
    });
});

