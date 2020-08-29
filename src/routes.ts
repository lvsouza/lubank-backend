import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { CreateUserController, AuthorizeUserController, UserBalanceController, DepositController } from './controllers';

const route = Router();

route.get('/', (_, res) => res.json("Lubank is working..."));

// Validação do token de acesso
route.use(celebrate({
    headers: Joi.object({
        authorization: Joi.string(),
        email: Joi.string().email({ minDomainSegments: 2 }),
        password: Joi.string()
    })
        .xor('password', 'authorization')
        .with('password', 'email')
        .unknown()
}));

// Rota para criação de usuário
const createUserController = new CreateUserController();
route.post('/api/signup', createUserController.validation, createUserController.execute);

// Rota que autoriza um usuário por token jwt usuário
const authorizeUserController = new AuthorizeUserController();
route.get('/api/sign', authorizeUserController.validation, authorizeUserController.execute);

// Rota que retorna o saldo atual do usuário
const userBalanceController = new UserBalanceController();
route.get('/api/balance', userBalanceController.execute);

// Rota que deposita um valor na conta de um usuário
const depositController = new DepositController();
route.post('/api/deposit', depositController.validation, depositController.execute);

export const routes = route;
