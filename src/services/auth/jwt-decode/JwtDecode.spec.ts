import { jwtEncode } from "./../jwt-encode/JwtEncode";
import { jwtDecode } from "./JwtDecode";

describe('Extração de dados do JWT', () => {

    beforeAll(async () => {

        // Configura a variável de ambiente para o JWT
        process.env.JWT_SECRET = '123456';
    });

    test('Testa a extração dos dados de um jwt', () => {

        // Define os dados do token
        const data = { user_id: 10 };

        // Cria um novo token
        const token = jwtEncode(data);

        // Faz o decode do token
        expect(jwtDecode(token)).toMatchObject(data);
    });
});
