require('dotenv/config');

import { jwtEncode } from "./../jwt-encode/JwtEncode";
import { jwtDecode } from "./JwtDecode";

test('Testa a extração dos dados de um jwt', () => {

    // Define os dados do token
    const data = { user_id: 10 };

    // Cria um novo token
    const token = jwtEncode(data);

    // Faz o decode do token
    expect(jwtDecode(token)).toMatchObject(data);
});
