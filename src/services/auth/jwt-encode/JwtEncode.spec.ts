require('dotenv/config');

import { jwtEncode } from "./JwtEncode";

test('Testa a criação de um jwt com um fake user_id', () => {
    const user_id = '10';

    const tokenValidation = () => {
        const token = jwtEncode({ user_id });
        return token.split('.').length;
    }

    expect(tokenValidation()).toBe(3);
});

